import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth';
import { hrPrisma } from '../../config/database';
import {
  getHrDashboard,
  getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee,
  getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment,
  getPositions, createPosition, updatePosition,
  getAttendance, clockIn, clockOut,
  getShifts, createShift, assignShift,
  getLeaveRequests, createLeaveRequest, approveLeave, rejectLeave,
  getPayrolls, generatePayroll, updatePayroll, processPayroll, markPayrollPaid,
  getPerformanceReviews, createPerformanceReview, updatePerformanceReview,
  getTrainings, createTraining, enrollTraining, completeTraining,
} from './hr.service';

const router = Router();

// All HR routes require auth
router.use(authMiddleware);

// ═══════════════════════════════════════════════════════
// HR AUTH — Sync TollGate user to HR system
// ═══════════════════════════════════════════════════════

router.post('/auth/sync', async (req: Request, res: Response) => {
  try {
    const { userId, email, name, role } = req.body;
    if (!userId || !email || !name) {
      res.status(400).json({ error: 'userId, email, and name are required' });
      return;
    }

    const hrUser = await hrPrisma.hrUser.upsert({
      where: { tollgateUserId: userId },
      update: { lastLoginAt: new Date(), email, name },
      create: {
        tollgateUserId: userId,
        email,
        name,
        role: role || 'HR_USER',
      },
    });

    res.json(hrUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync HR user' });
  }
});

router.get('/auth/me', async (req: Request, res: Response) => {
  try {
    const tollgateUserId = (req as any).user?.userId;
    if (!tollgateUserId) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const hrUser = await hrPrisma.hrUser.findUnique({
      where: { tollgateUserId },
    });

    if (!hrUser) {
      res.status(404).json({ error: 'HR user not found. Please sync first.' });
      return;
    }

    res.json(hrUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get HR user' });
  }
});

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════

router.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const data = await getHrDashboard();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HR dashboard' });
  }
});

// ═══════════════════════════════════════════════════════
// EMPLOYEES
// ═══════════════════════════════════════════════════════

router.get('/employees', async (req: Request, res: Response) => {
  try {
    const { search, status, departmentId, page, limit } = req.query;
    const result = await getEmployees({
      search: search as string,
      status: status as string,
      departmentId: departmentId as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

router.get('/employees/:id', async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) { res.status(404).json({ error: 'Employee not found' }); return; }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

router.post('/employees', requireRole('ADMIN', 'SUPER_ADMIN', 'HR_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, departmentId, positionId, salary, hireDate } = req.body;
    if (!firstName || !lastName || !email || !departmentId || !positionId || !salary || !hireDate) {
      res.status(400).json({ error: 'Missing required fields: firstName, lastName, email, departmentId, positionId, salary, hireDate' });
      return;
    }
    const employee = await createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ error: 'Employee with this email already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

router.put('/employees/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'HR_ADMIN'), async (req: Request, res: Response) => {
  try {
    const employee = await updateEmployee(req.params.id, req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

router.delete('/employees/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteEmployee(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// ═══════════════════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════════════════

router.get('/departments', async (_req: Request, res: Response) => {
  try {
    const departments = await getDepartments();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

router.get('/departments/:id', async (req: Request, res: Response) => {
  try {
    const dept = await getDepartmentById(req.params.id);
    if (!dept) { res.status(404).json({ error: 'Department not found' }); return; }
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

router.post('/departments', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { name, code, type } = req.body;
    if (!name || !code || !type) {
      res.status(400).json({ error: 'Missing required fields: name, code, type' });
      return;
    }
    const dept = await createDepartment(req.body);
    res.status(201).json(dept);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ error: 'Department with this name or code already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create department' });
  }
});

router.put('/departments/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const dept = await updateDepartment(req.params.id, req.body);
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

router.delete('/departments/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteDepartment(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

// ═══════════════════════════════════════════════════════
// POSITIONS
// ═══════════════════════════════════════════════════════

router.get('/positions', async (req: Request, res: Response) => {
  try {
    const positions = await getPositions(req.query.departmentId as string);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

router.post('/positions', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { title, code, departmentId } = req.body;
    if (!title || !code || !departmentId) {
      res.status(400).json({ error: 'Missing required fields: title, code, departmentId' });
      return;
    }
    const position = await createPosition(req.body);
    res.status(201).json(position);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ error: 'Position with this code already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create position' });
  }
});

router.put('/positions/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const position = await updatePosition(req.params.id, req.body);
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// ═══════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════

router.get('/attendance', async (req: Request, res: Response) => {
  try {
    const { employeeId, date, startDate, endDate, status, page, limit } = req.query;
    const result = await getAttendance({
      employeeId: employeeId as string,
      date: date as string,
      startDate: startDate as string,
      endDate: endDate as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

router.post('/attendance/clock-in', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) { res.status(400).json({ error: 'employeeId is required' }); return; }
    const record = await clockIn(employeeId);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to clock in' });
  }
});

router.post('/attendance/clock-out', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) { res.status(400).json({ error: 'employeeId is required' }); return; }
    const record = await clockOut(employeeId);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to clock out' });
  }
});

// ═══════════════════════════════════════════════════════
// SHIFTS
// ═══════════════════════════════════════════════════════

router.get('/shifts', async (_req: Request, res: Response) => {
  try {
    const shifts = await getShifts();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});

router.post('/shifts', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { name, code, startTime, endTime } = req.body;
    if (!name || !code || !startTime || !endTime) {
      res.status(400).json({ error: 'Missing required fields: name, code, startTime, endTime' });
      return;
    }
    const shift = await createShift(req.body);
    res.status(201).json(shift);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ error: 'Shift with this code already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create shift' });
  }
});

router.post('/shifts/assign', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { employeeId, shiftId, date } = req.body;
    if (!employeeId || !shiftId || !date) {
      res.status(400).json({ error: 'Missing required fields: employeeId, shiftId, date' });
      return;
    }
    const assignment = await assignShift({ employeeId, shiftId, date });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign shift' });
  }
});

// ═══════════════════════════════════════════════════════
// LEAVE REQUESTS
// ═══════════════════════════════════════════════════════

router.get('/leave', async (req: Request, res: Response) => {
  try {
    const { employeeId, status, leaveType, page, limit } = req.query;
    const result = await getLeaveRequests({
      employeeId: employeeId as string,
      status: status as string,
      leaveType: leaveType as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

router.post('/leave', async (req: Request, res: Response) => {
  try {
    const { employeeId, leaveType, startDate, endDate } = req.body;
    if (!employeeId || !leaveType || !startDate || !endDate) {
      res.status(400).json({ error: 'Missing required fields: employeeId, leaveType, startDate, endDate' });
      return;
    }
    const leave = await createLeaveRequest(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create leave request' });
  }
});

router.post('/leave/:id/approve', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const leave = await approveLeave(req.params.id, (req as any).user?.userId || 'system');
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve leave' });
  }
});

router.post('/leave/:id/reject', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const leave = await rejectLeave(req.params.id, (req as any).user?.userId || 'system', reason);
    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject leave' });
  }
});

// ═══════════════════════════════════════════════════════
// PAYROLL
// ═══════════════════════════════════════════════════════

router.get('/payroll', async (req: Request, res: Response) => {
  try {
    const { employeeId, payPeriod, status, page, limit } = req.query;
    const result = await getPayrolls({
      employeeId: employeeId as string,
      payPeriod: payPeriod as string,
      status: status as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll' });
  }
});

router.post('/payroll/generate', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { payPeriod } = req.body;
    if (!payPeriod) { res.status(400).json({ error: 'payPeriod is required (e.g., 2026-01)' }); return; }
    const results = await generatePayroll(payPeriod);
    res.status(201).json({ generated: results.length, payrolls: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate payroll' });
  }
});

router.put('/payroll/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ADMIN'), async (req: Request, res: Response) => {
  try {
    const payroll = await updatePayroll(req.params.id, req.body);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payroll' });
  }
});

router.post('/payroll/:id/process', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ADMIN'), async (req: Request, res: Response) => {
  try {
    const payroll = await processPayroll(req.params.id);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payroll' });
  }
});

router.post('/payroll/:id/pay', requireRole('ADMIN', 'SUPER_ADMIN', 'FINANCIAL_ADMIN'), async (req: Request, res: Response) => {
  try {
    const payroll = await markPayrollPaid(req.params.id);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark payroll as paid' });
  }
});

// ═══════════════════════════════════════════════════════
// PERFORMANCE REVIEWS
// ═══════════════════════════════════════════════════════

router.get('/performance', async (req: Request, res: Response) => {
  try {
    const reviews = await getPerformanceReviews(req.query.employeeId as string);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance reviews' });
  }
});

router.post('/performance', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { employeeId, reviewerId, period, rating } = req.body;
    if (!employeeId || !reviewerId || !period || !rating) {
      res.status(400).json({ error: 'Missing required fields: employeeId, reviewerId, period, rating' });
      return;
    }
    const review = await createPerformanceReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create performance review' });
  }
});

router.put('/performance/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const review = await updatePerformanceReview(req.params.id, req.body);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update performance review' });
  }
});

// ═══════════════════════════════════════════════════════
// TRAINING
// ═══════════════════════════════════════════════════════

router.get('/training', async (_req: Request, res: Response) => {
  try {
    const trainings = await getTrainings();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

router.post('/training', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { title, code } = req.body;
    if (!title || !code) {
      res.status(400).json({ error: 'Missing required fields: title, code' });
      return;
    }
    const training = await createTraining(req.body);
    res.status(201).json(training);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      res.status(409).json({ error: 'Training with this code already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create training' });
  }
});

router.post('/training/enroll', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { employeeId, trainingId } = req.body;
    if (!employeeId || !trainingId) {
      res.status(400).json({ error: 'employeeId and trainingId are required' });
      return;
    }
    const enrollment = await enrollTraining(employeeId, trainingId);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll in training' });
  }
});

router.post('/training/complete', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  try {
    const { employeeId, trainingId, score, certificate } = req.body;
    if (!employeeId || !trainingId) {
      res.status(400).json({ error: 'employeeId and trainingId are required' });
      return;
    }
    const enrollment = await completeTraining(employeeId, trainingId, score, certificate);
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete training' });
  }
});

export default router;
