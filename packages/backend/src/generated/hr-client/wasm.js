
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.HrUserScalarFieldEnum = {
  id: 'id',
  tollgateUserId: 'tollgateUserId',
  email: 'email',
  name: 'name',
  role: 'role',
  status: 'status',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  type: 'type',
  description: 'description',
  managerId: 'managerId',
  parentId: 'parentId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PositionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  code: 'code',
  departmentId: 'departmentId',
  level: 'level',
  minSalary: 'minSalary',
  maxSalary: 'maxSalary',
  description: 'description',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  employeeNumber: 'employeeNumber',
  tollgateUserId: 'tollgateUserId',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  nrcNumber: 'nrcNumber',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  address: 'address',
  emergencyContact: 'emergencyContact',
  emergencyPhone: 'emergencyPhone',
  departmentId: 'departmentId',
  positionId: 'positionId',
  managerId: 'managerId',
  hireDate: 'hireDate',
  salary: 'salary',
  status: 'status',
  terminationDate: 'terminationDate',
  profilePhoto: 'profilePhoto',
  notes: 'notes',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttendanceScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  date: 'date',
  clockIn: 'clockIn',
  clockOut: 'clockOut',
  status: 'status',
  hoursWorked: 'hoursWorked',
  overtime: 'overtime',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShiftScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  startTime: 'startTime',
  endTime: 'endTime',
  breakMins: 'breakMins',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShiftAssignmentScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  shiftId: 'shiftId',
  date: 'date',
  createdAt: 'createdAt'
};

exports.Prisma.LeaveRequestScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  leaveType: 'leaveType',
  startDate: 'startDate',
  endDate: 'endDate',
  days: 'days',
  reason: 'reason',
  status: 'status',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayrollScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  payPeriod: 'payPeriod',
  baseSalary: 'baseSalary',
  allowances: 'allowances',
  deductions: 'deductions',
  overtimePay: 'overtimePay',
  bonus: 'bonus',
  tax: 'tax',
  netPay: 'netPay',
  status: 'status',
  paidAt: 'paidAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PerformanceReviewScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  reviewerId: 'reviewerId',
  period: 'period',
  rating: 'rating',
  goals: 'goals',
  strengths: 'strengths',
  improvements: 'improvements',
  comments: 'comments',
  nextReview: 'nextReview',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TrainingScalarFieldEnum = {
  id: 'id',
  title: 'title',
  code: 'code',
  description: 'description',
  duration: 'duration',
  provider: 'provider',
  cost: 'cost',
  maxEnroll: 'maxEnroll',
  startDate: 'startDate',
  endDate: 'endDate',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TrainingEnrollmentScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  trainingId: 'trainingId',
  enrolledAt: 'enrolledAt',
  completedAt: 'completedAt',
  score: 'score',
  certificate: 'certificate',
  status: 'status'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.DepartmentType = exports.$Enums.DepartmentType = {
  OPERATIONS: 'OPERATIONS',
  FINANCE: 'FINANCE',
  ENGINEERING: 'ENGINEERING',
  HR: 'HR',
  MAINTENANCE: 'MAINTENANCE',
  SECURITY: 'SECURITY',
  ADMIN: 'ADMIN',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE'
};

exports.EmployeeStatus = exports.$Enums.EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  TERMINATED: 'TERMINATED'
};

exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  HALF_DAY: 'HALF_DAY',
  ON_LEAVE: 'ON_LEAVE'
};

exports.LeaveType = exports.$Enums.LeaveType = {
  ANNUAL: 'ANNUAL',
  SICK: 'SICK',
  MATERNITY: 'MATERNITY',
  PATERNITY: 'PATERNITY',
  UNPAID: 'UNPAID',
  EMERGENCY: 'EMERGENCY'
};

exports.LeaveStatus = exports.$Enums.LeaveStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

exports.PayrollStatus = exports.$Enums.PayrollStatus = {
  DRAFT: 'DRAFT',
  PROCESSED: 'PROCESSED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

exports.PerformanceRating = exports.$Enums.PerformanceRating = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  AVERAGE: 'AVERAGE',
  BELOW_AVERAGE: 'BELOW_AVERAGE',
  POOR: 'POOR'
};

exports.TrainingStatus = exports.$Enums.TrainingStatus = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.Prisma.ModelName = {
  HrUser: 'HrUser',
  Department: 'Department',
  Position: 'Position',
  Employee: 'Employee',
  Attendance: 'Attendance',
  Shift: 'Shift',
  ShiftAssignment: 'ShiftAssignment',
  LeaveRequest: 'LeaveRequest',
  Payroll: 'Payroll',
  PerformanceReview: 'PerformanceReview',
  Training: 'Training',
  TrainingEnrollment: 'TrainingEnrollment'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
