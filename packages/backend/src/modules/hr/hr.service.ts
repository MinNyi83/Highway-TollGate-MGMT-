import { hrPrisma as prisma } from '../../config/database';

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════

export async function getHrDashboard() {
  const [totalEmployees, activeEmployees, departments, pendingLeaves, recentHires, attendanceToday] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    prisma.department.count({ where: { status: 'ACTIVE' } }),
    prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    prisma.employee.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { hireDate: 'desc' },
      take: 5,
      include: { department: true, position: true },
    }),
    prisma.attendance.count({
      where: {
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: 'PRESENT',
      },
    }),
  ]);

  const statusCounts = await prisma.employee.groupBy({
    by: ['status'],
    _count: true,
  });

  const deptCounts = await prisma.department.findMany({
    where: { status: 'ACTIVE' },
    include: { _count: { select: { employees: true } } },
  });

  return {
    totalEmployees,
    activeEmployees,
    departments,
    pendingLeaves,
    attendanceToday,
    recentHires,
    statusCounts: statusCounts.map((s) => ({ status: s.status, count: s._count })),
    deptCounts: deptCounts.map((d) => ({ name: d.name, code: d.code, count: d._count.employees })),
  };
}

// ═══════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════

export interface EmployeeFilters {
  search?: string;
  status?: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}

export async function getEmployees(filters?: EmployeeFilters) {
  const where: any = {};
  if (filters?.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: 'insensitive' } },
      { lastName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { employeeNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  if (filters?.status) where.status = filters.status;
  if (filters?.departmentId) where.departmentId = filters.departmentId;

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: { department: true, position: true, manager: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.employee.count({ where }),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getEmployeeById(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      position: true,
      manager: { select: { id: true, firstName: true, lastName: true, employeeNumber: true } },
      directReports: { select: { id: true, firstName: true, lastName: true, employeeNumber: true } },
      attendances: { orderBy: { date: 'desc' }, take: 30 },
      leaveRequests: { orderBy: { createdAt: 'desc' }, take: 10 },
      payrolls: { orderBy: { createdAt: 'desc' }, take: 12 },
      performances: { orderBy: { createdAt: 'desc' }, take: 5 },
      trainingEnrollments: { include: { training: true }, orderBy: { enrolledAt: 'desc' } },
    },
  });
}

export async function createEmployee(data: any) {
  const count = await prisma.employee.count();
  const employeeNumber = `EMP-${String(count + 1).padStart(5, '0')}`;
  return prisma.employee.create({
    data: { ...data, employeeNumber },
    include: { department: true, position: true },
  });
}

export async function updateEmployee(id: string, data: any) {
  return prisma.employee.update({
    where: { id },
    data,
    include: { department: true, position: true },
  });
}

export async function deleteEmployee(id: string) {
  return prisma.employee.delete({ where: { id } });
}

// ═══════════════════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════════════════

export async function getDepartments() {
  return prisma.department.findMany({
    include: { _count: { select: { employees: true, children: true } }, parent: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function getDepartmentById(id: string) {
  return prisma.department.findUnique({
    where: { id },
    include: {
      employees: { include: { position: true } },
      children: true,
      parent: true,
    },
  });
}

export async function createDepartment(data: any) {
  return prisma.department.create({ data });
}

export async function updateDepartment(id: string, data: any) {
  return prisma.department.update({ where: { id }, data });
}

export async function deleteDepartment(id: string) {
  return prisma.department.delete({ where: { id } });
}

// ═══════════════════════════════════════════════════════
// POSITIONS
// ═══════════════════════════════════════════════════════

export async function getPositions(departmentId?: string) {
  const where: any = {};
  if (departmentId) where.departmentId = departmentId;
  return prisma.position.findMany({
    where,
    include: { department: { select: { id: true, name: true } }, _count: { select: { employees: true } } },
    orderBy: { title: 'asc' },
  });
}

export async function createPosition(data: any) {
  return prisma.position.create({ data, include: { department: true } });
}

export async function updatePosition(id: string, data: any) {
  return prisma.position.update({ where: { id }, data });
}

// ═══════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════

export interface AttendanceFilters {
  employeeId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getAttendance(filters?: AttendanceFilters) {
  const where: any = {};
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.status) where.status = filters.status;
  if (filters?.date) {
    const d = new Date(filters.date);
    where.date = { gte: d, lt: new Date(d.getTime() + 86400000) };
  }
  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: { employee: { select: { id: true, firstName: true, lastName: true, employeeNumber: true } } },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.attendance.count({ where }),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function clockIn(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId, date: { gte: today, lt: new Date(today.getTime() + 86400000) } },
  });

  if (existing) {
    return prisma.attendance.update({
      where: { id: existing.id },
      data: { clockIn: new Date() },
    });
  }

  return prisma.attendance.create({
    data: {
      employeeId,
      date: today,
      clockIn: new Date(),
      status: 'PRESENT',
    },
  });
}

export async function clockOut(employeeId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId, date: { gte: today, lt: new Date(today.getTime() + 86400000) } },
  });

  if (!existing) throw new Error('No clock-in found for today');

  const clockOut = new Date();
  const hoursWorked = existing.clockIn
    ? Math.round(((clockOut.getTime() - existing.clockIn.getTime()) / 3600000) * 100) / 100
    : 0;

  return prisma.attendance.update({
    where: { id: existing.id },
    data: { clockOut, hoursWorked },
  });
}

// ═══════════════════════════════════════════════════════
// SHIFTS
// ═══════════════════════════════════════════════════════

export async function getShifts() {
  return prisma.shift.findMany({
    include: { _count: { select: { assignments: true } } },
    orderBy: { startTime: 'asc' },
  });
}

export async function createShift(data: any) {
  return prisma.shift.create({ data });
}

export async function assignShift(data: { employeeId: string; shiftId: string; date: string }) {
  return prisma.shiftAssignment.upsert({
    where: { employeeId_date: { employeeId: data.employeeId, date: new Date(data.date) } },
    update: { shiftId: data.shiftId },
    create: { employeeId: data.employeeId, shiftId: data.shiftId, date: new Date(data.date) },
  });
}

// ═══════════════════════════════════════════════════════
// LEAVE REQUESTS
// ═══════════════════════════════════════════════════════

export interface LeaveFilters {
  employeeId?: string;
  status?: string;
  leaveType?: string;
  page?: number;
  limit?: number;
}

export async function getLeaveRequests(filters?: LeaveFilters) {
  const where: any = {};
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.status) where.status = filters.status;
  if (filters?.leaveType) where.leaveType = filters.leaveType;

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.leaveRequest.findMany({
      where,
      include: { employee: { select: { id: true, firstName: true, lastName: true, employeeNumber: true, department: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function createLeaveRequest(data: any) {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;

  return prisma.leaveRequest.create({
    data: { ...data, days },
    include: { employee: { select: { firstName: true, lastName: true, employeeNumber: true } } },
  });
}

export async function approveLeave(id: string, approvedBy: string) {
  return prisma.leaveRequest.update({
    where: { id },
    data: { status: 'APPROVED', approvedBy, approvedAt: new Date() },
  });
}

export async function rejectLeave(id: string, rejectedBy: string, reason?: string) {
  return prisma.leaveRequest.update({
    where: { id },
    data: { status: 'REJECTED', approvedBy: rejectedBy, rejectionReason: reason },
  });
}

// ═══════════════════════════════════════════════════════
// PAYROLL
// ═══════════════════════════════════════════════════════

export interface PayrollFilters {
  employeeId?: string;
  payPeriod?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getPayrolls(filters?: PayrollFilters) {
  const where: any = {};
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.payPeriod) where.payPeriod = filters.payPeriod;
  if (filters?.status) where.status = filters.status;

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.payroll.findMany({
      where,
      include: { employee: { select: { id: true, firstName: true, lastName: true, employeeNumber: true, department: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.payroll.count({ where }),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function generatePayroll(payPeriod: string) {
  const activeEmployees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, salary: true },
  });

  const results = [];
  for (const emp of activeEmployees) {
    const existing = await prisma.payroll.findFirst({
      where: { employeeId: emp.id, payPeriod },
    });
    if (existing) continue;

    const netPay = Number(emp.salary);
    const payroll = await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        payPeriod,
        baseSalary: emp.salary,
        netPay,
        status: 'DRAFT',
      },
    });
    results.push(payroll);
  }
  return results;
}

export async function updatePayroll(id: string, data: any) {
  return prisma.payroll.update({ where: { id }, data });
}

export async function processPayroll(id: string) {
  return prisma.payroll.update({
    where: { id },
    data: { status: 'PROCESSED' },
  });
}

export async function markPayrollPaid(id: string) {
  return prisma.payroll.update({
    where: { id },
    data: { status: 'PAID', paidAt: new Date() },
  });
}

// ═══════════════════════════════════════════════════════
// PERFORMANCE REVIEWS
// ═══════════════════════════════════════════════════════

export async function getPerformanceReviews(employeeId?: string) {
  const where: any = {};
  if (employeeId) where.employeeId = employeeId;

  return prisma.performanceReview.findMany({
    where,
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeNumber: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPerformanceReview(data: any) {
  return prisma.performanceReview.create({
    data,
    include: { employee: { select: { firstName: true, lastName: true } } },
  });
}

export async function updatePerformanceReview(id: string, data: any) {
  return prisma.performanceReview.update({ where: { id }, data });
}

// ═══════════════════════════════════════════════════════
// TRAINING
// ═══════════════════════════════════════════════════════

export async function getTrainings() {
  return prisma.training.findMany({
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTraining(data: any) {
  return prisma.training.create({ data });
}

export async function enrollTraining(employeeId: string, trainingId: string) {
  return prisma.trainingEnrollment.upsert({
    where: { employeeId_trainingId: { employeeId, trainingId } },
    update: {},
    create: { employeeId, trainingId },
  });
}

export async function completeTraining(employeeId: string, trainingId: string, score?: number, certificate?: string) {
  return prisma.trainingEnrollment.update({
    where: { employeeId_trainingId: { employeeId, trainingId } },
    data: { status: 'COMPLETED', completedAt: new Date(), score, certificate },
  });
}
