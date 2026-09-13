
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model HrUser
 * 
 */
export type HrUser = $Result.DefaultSelection<Prisma.$HrUserPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model Position
 * 
 */
export type Position = $Result.DefaultSelection<Prisma.$PositionPayload>
/**
 * Model Employee
 * 
 */
export type Employee = $Result.DefaultSelection<Prisma.$EmployeePayload>
/**
 * Model Attendance
 * 
 */
export type Attendance = $Result.DefaultSelection<Prisma.$AttendancePayload>
/**
 * Model Shift
 * 
 */
export type Shift = $Result.DefaultSelection<Prisma.$ShiftPayload>
/**
 * Model ShiftAssignment
 * 
 */
export type ShiftAssignment = $Result.DefaultSelection<Prisma.$ShiftAssignmentPayload>
/**
 * Model LeaveRequest
 * 
 */
export type LeaveRequest = $Result.DefaultSelection<Prisma.$LeaveRequestPayload>
/**
 * Model Payroll
 * 
 */
export type Payroll = $Result.DefaultSelection<Prisma.$PayrollPayload>
/**
 * Model PerformanceReview
 * 
 */
export type PerformanceReview = $Result.DefaultSelection<Prisma.$PerformanceReviewPayload>
/**
 * Model Training
 * 
 */
export type Training = $Result.DefaultSelection<Prisma.$TrainingPayload>
/**
 * Model TrainingEnrollment
 * 
 */
export type TrainingEnrollment = $Result.DefaultSelection<Prisma.$TrainingEnrollmentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const DepartmentType: {
  OPERATIONS: 'OPERATIONS',
  FINANCE: 'FINANCE',
  ENGINEERING: 'ENGINEERING',
  HR: 'HR',
  MAINTENANCE: 'MAINTENANCE',
  SECURITY: 'SECURITY',
  ADMIN: 'ADMIN',
  CUSTOMER_SERVICE: 'CUSTOMER_SERVICE'
};

export type DepartmentType = (typeof DepartmentType)[keyof typeof DepartmentType]


export const EmployeeStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  TERMINATED: 'TERMINATED'
};

export type EmployeeStatus = (typeof EmployeeStatus)[keyof typeof EmployeeStatus]


export const AttendanceStatus: {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  HALF_DAY: 'HALF_DAY',
  ON_LEAVE: 'ON_LEAVE'
};

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus]


export const LeaveType: {
  ANNUAL: 'ANNUAL',
  SICK: 'SICK',
  MATERNITY: 'MATERNITY',
  PATERNITY: 'PATERNITY',
  UNPAID: 'UNPAID',
  EMERGENCY: 'EMERGENCY'
};

export type LeaveType = (typeof LeaveType)[keyof typeof LeaveType]


export const LeaveStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export type LeaveStatus = (typeof LeaveStatus)[keyof typeof LeaveStatus]


export const PayrollStatus: {
  DRAFT: 'DRAFT',
  PROCESSED: 'PROCESSED',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
};

export type PayrollStatus = (typeof PayrollStatus)[keyof typeof PayrollStatus]


export const PerformanceRating: {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  AVERAGE: 'AVERAGE',
  BELOW_AVERAGE: 'BELOW_AVERAGE',
  POOR: 'POOR'
};

export type PerformanceRating = (typeof PerformanceRating)[keyof typeof PerformanceRating]


export const TrainingStatus: {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type TrainingStatus = (typeof TrainingStatus)[keyof typeof TrainingStatus]

}

export type DepartmentType = $Enums.DepartmentType

export const DepartmentType: typeof $Enums.DepartmentType

export type EmployeeStatus = $Enums.EmployeeStatus

export const EmployeeStatus: typeof $Enums.EmployeeStatus

export type AttendanceStatus = $Enums.AttendanceStatus

export const AttendanceStatus: typeof $Enums.AttendanceStatus

export type LeaveType = $Enums.LeaveType

export const LeaveType: typeof $Enums.LeaveType

export type LeaveStatus = $Enums.LeaveStatus

export const LeaveStatus: typeof $Enums.LeaveStatus

export type PayrollStatus = $Enums.PayrollStatus

export const PayrollStatus: typeof $Enums.PayrollStatus

export type PerformanceRating = $Enums.PerformanceRating

export const PerformanceRating: typeof $Enums.PerformanceRating

export type TrainingStatus = $Enums.TrainingStatus

export const TrainingStatus: typeof $Enums.TrainingStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more HrUsers
 * const hrUsers = await prisma.hrUser.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more HrUsers
   * const hrUsers = await prisma.hrUser.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.hrUser`: Exposes CRUD operations for the **HrUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HrUsers
    * const hrUsers = await prisma.hrUser.findMany()
    * ```
    */
  get hrUser(): Prisma.HrUserDelegate<ExtArgs>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs>;

  /**
   * `prisma.position`: Exposes CRUD operations for the **Position** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Positions
    * const positions = await prisma.position.findMany()
    * ```
    */
  get position(): Prisma.PositionDelegate<ExtArgs>;

  /**
   * `prisma.employee`: Exposes CRUD operations for the **Employee** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Employees
    * const employees = await prisma.employee.findMany()
    * ```
    */
  get employee(): Prisma.EmployeeDelegate<ExtArgs>;

  /**
   * `prisma.attendance`: Exposes CRUD operations for the **Attendance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attendances
    * const attendances = await prisma.attendance.findMany()
    * ```
    */
  get attendance(): Prisma.AttendanceDelegate<ExtArgs>;

  /**
   * `prisma.shift`: Exposes CRUD operations for the **Shift** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shifts
    * const shifts = await prisma.shift.findMany()
    * ```
    */
  get shift(): Prisma.ShiftDelegate<ExtArgs>;

  /**
   * `prisma.shiftAssignment`: Exposes CRUD operations for the **ShiftAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShiftAssignments
    * const shiftAssignments = await prisma.shiftAssignment.findMany()
    * ```
    */
  get shiftAssignment(): Prisma.ShiftAssignmentDelegate<ExtArgs>;

  /**
   * `prisma.leaveRequest`: Exposes CRUD operations for the **LeaveRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LeaveRequests
    * const leaveRequests = await prisma.leaveRequest.findMany()
    * ```
    */
  get leaveRequest(): Prisma.LeaveRequestDelegate<ExtArgs>;

  /**
   * `prisma.payroll`: Exposes CRUD operations for the **Payroll** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payrolls
    * const payrolls = await prisma.payroll.findMany()
    * ```
    */
  get payroll(): Prisma.PayrollDelegate<ExtArgs>;

  /**
   * `prisma.performanceReview`: Exposes CRUD operations for the **PerformanceReview** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PerformanceReviews
    * const performanceReviews = await prisma.performanceReview.findMany()
    * ```
    */
  get performanceReview(): Prisma.PerformanceReviewDelegate<ExtArgs>;

  /**
   * `prisma.training`: Exposes CRUD operations for the **Training** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trainings
    * const trainings = await prisma.training.findMany()
    * ```
    */
  get training(): Prisma.TrainingDelegate<ExtArgs>;

  /**
   * `prisma.trainingEnrollment`: Exposes CRUD operations for the **TrainingEnrollment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrainingEnrollments
    * const trainingEnrollments = await prisma.trainingEnrollment.findMany()
    * ```
    */
  get trainingEnrollment(): Prisma.TrainingEnrollmentDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "hrUser" | "department" | "position" | "employee" | "attendance" | "shift" | "shiftAssignment" | "leaveRequest" | "payroll" | "performanceReview" | "training" | "trainingEnrollment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      HrUser: {
        payload: Prisma.$HrUserPayload<ExtArgs>
        fields: Prisma.HrUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HrUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HrUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>
          }
          findFirst: {
            args: Prisma.HrUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HrUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>
          }
          findMany: {
            args: Prisma.HrUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>[]
          }
          create: {
            args: Prisma.HrUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>
          }
          createMany: {
            args: Prisma.HrUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HrUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>[]
          }
          delete: {
            args: Prisma.HrUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>
          }
          update: {
            args: Prisma.HrUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>
          }
          deleteMany: {
            args: Prisma.HrUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HrUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HrUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HrUserPayload>
          }
          aggregate: {
            args: Prisma.HrUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHrUser>
          }
          groupBy: {
            args: Prisma.HrUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<HrUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.HrUserCountArgs<ExtArgs>
            result: $Utils.Optional<HrUserCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      Position: {
        payload: Prisma.$PositionPayload<ExtArgs>
        fields: Prisma.PositionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PositionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PositionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          findFirst: {
            args: Prisma.PositionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PositionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          findMany: {
            args: Prisma.PositionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>[]
          }
          create: {
            args: Prisma.PositionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          createMany: {
            args: Prisma.PositionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PositionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>[]
          }
          delete: {
            args: Prisma.PositionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          update: {
            args: Prisma.PositionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          deleteMany: {
            args: Prisma.PositionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PositionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PositionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PositionPayload>
          }
          aggregate: {
            args: Prisma.PositionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePosition>
          }
          groupBy: {
            args: Prisma.PositionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PositionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PositionCountArgs<ExtArgs>
            result: $Utils.Optional<PositionCountAggregateOutputType> | number
          }
        }
      }
      Employee: {
        payload: Prisma.$EmployeePayload<ExtArgs>
        fields: Prisma.EmployeeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmployeeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmployeeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          findFirst: {
            args: Prisma.EmployeeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmployeeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          findMany: {
            args: Prisma.EmployeeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[]
          }
          create: {
            args: Prisma.EmployeeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          createMany: {
            args: Prisma.EmployeeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmployeeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>[]
          }
          delete: {
            args: Prisma.EmployeeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          update: {
            args: Prisma.EmployeeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          deleteMany: {
            args: Prisma.EmployeeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmployeeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmployeeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmployeePayload>
          }
          aggregate: {
            args: Prisma.EmployeeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmployee>
          }
          groupBy: {
            args: Prisma.EmployeeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmployeeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmployeeCountArgs<ExtArgs>
            result: $Utils.Optional<EmployeeCountAggregateOutputType> | number
          }
        }
      }
      Attendance: {
        payload: Prisma.$AttendancePayload<ExtArgs>
        fields: Prisma.AttendanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttendanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttendanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          findFirst: {
            args: Prisma.AttendanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttendanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          findMany: {
            args: Prisma.AttendanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>[]
          }
          create: {
            args: Prisma.AttendanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          createMany: {
            args: Prisma.AttendanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AttendanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>[]
          }
          delete: {
            args: Prisma.AttendanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          update: {
            args: Prisma.AttendanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          deleteMany: {
            args: Prisma.AttendanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AttendanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AttendanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          aggregate: {
            args: Prisma.AttendanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttendance>
          }
          groupBy: {
            args: Prisma.AttendanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AttendanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.AttendanceCountArgs<ExtArgs>
            result: $Utils.Optional<AttendanceCountAggregateOutputType> | number
          }
        }
      }
      Shift: {
        payload: Prisma.$ShiftPayload<ExtArgs>
        fields: Prisma.ShiftFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShiftFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShiftFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          findFirst: {
            args: Prisma.ShiftFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShiftFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          findMany: {
            args: Prisma.ShiftFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>[]
          }
          create: {
            args: Prisma.ShiftCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          createMany: {
            args: Prisma.ShiftCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShiftCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>[]
          }
          delete: {
            args: Prisma.ShiftDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          update: {
            args: Prisma.ShiftUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          deleteMany: {
            args: Prisma.ShiftDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShiftUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShiftUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftPayload>
          }
          aggregate: {
            args: Prisma.ShiftAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShift>
          }
          groupBy: {
            args: Prisma.ShiftGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShiftGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShiftCountArgs<ExtArgs>
            result: $Utils.Optional<ShiftCountAggregateOutputType> | number
          }
        }
      }
      ShiftAssignment: {
        payload: Prisma.$ShiftAssignmentPayload<ExtArgs>
        fields: Prisma.ShiftAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShiftAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShiftAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>
          }
          findFirst: {
            args: Prisma.ShiftAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShiftAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>
          }
          findMany: {
            args: Prisma.ShiftAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>[]
          }
          create: {
            args: Prisma.ShiftAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>
          }
          createMany: {
            args: Prisma.ShiftAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShiftAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>[]
          }
          delete: {
            args: Prisma.ShiftAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>
          }
          update: {
            args: Prisma.ShiftAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.ShiftAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShiftAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShiftAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShiftAssignmentPayload>
          }
          aggregate: {
            args: Prisma.ShiftAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShiftAssignment>
          }
          groupBy: {
            args: Prisma.ShiftAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShiftAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShiftAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<ShiftAssignmentCountAggregateOutputType> | number
          }
        }
      }
      LeaveRequest: {
        payload: Prisma.$LeaveRequestPayload<ExtArgs>
        fields: Prisma.LeaveRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeaveRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeaveRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>
          }
          findFirst: {
            args: Prisma.LeaveRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeaveRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>
          }
          findMany: {
            args: Prisma.LeaveRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>[]
          }
          create: {
            args: Prisma.LeaveRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>
          }
          createMany: {
            args: Prisma.LeaveRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeaveRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>[]
          }
          delete: {
            args: Prisma.LeaveRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>
          }
          update: {
            args: Prisma.LeaveRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>
          }
          deleteMany: {
            args: Prisma.LeaveRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeaveRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LeaveRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaveRequestPayload>
          }
          aggregate: {
            args: Prisma.LeaveRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeaveRequest>
          }
          groupBy: {
            args: Prisma.LeaveRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeaveRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeaveRequestCountArgs<ExtArgs>
            result: $Utils.Optional<LeaveRequestCountAggregateOutputType> | number
          }
        }
      }
      Payroll: {
        payload: Prisma.$PayrollPayload<ExtArgs>
        fields: Prisma.PayrollFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayrollFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayrollFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>
          }
          findFirst: {
            args: Prisma.PayrollFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayrollFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>
          }
          findMany: {
            args: Prisma.PayrollFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>[]
          }
          create: {
            args: Prisma.PayrollCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>
          }
          createMany: {
            args: Prisma.PayrollCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PayrollCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>[]
          }
          delete: {
            args: Prisma.PayrollDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>
          }
          update: {
            args: Prisma.PayrollUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>
          }
          deleteMany: {
            args: Prisma.PayrollDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayrollUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayrollUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollPayload>
          }
          aggregate: {
            args: Prisma.PayrollAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayroll>
          }
          groupBy: {
            args: Prisma.PayrollGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayrollGroupByOutputType>[]
          }
          count: {
            args: Prisma.PayrollCountArgs<ExtArgs>
            result: $Utils.Optional<PayrollCountAggregateOutputType> | number
          }
        }
      }
      PerformanceReview: {
        payload: Prisma.$PerformanceReviewPayload<ExtArgs>
        fields: Prisma.PerformanceReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PerformanceReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PerformanceReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>
          }
          findFirst: {
            args: Prisma.PerformanceReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PerformanceReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>
          }
          findMany: {
            args: Prisma.PerformanceReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>[]
          }
          create: {
            args: Prisma.PerformanceReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>
          }
          createMany: {
            args: Prisma.PerformanceReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PerformanceReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>[]
          }
          delete: {
            args: Prisma.PerformanceReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>
          }
          update: {
            args: Prisma.PerformanceReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>
          }
          deleteMany: {
            args: Prisma.PerformanceReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PerformanceReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PerformanceReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerformanceReviewPayload>
          }
          aggregate: {
            args: Prisma.PerformanceReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePerformanceReview>
          }
          groupBy: {
            args: Prisma.PerformanceReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<PerformanceReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.PerformanceReviewCountArgs<ExtArgs>
            result: $Utils.Optional<PerformanceReviewCountAggregateOutputType> | number
          }
        }
      }
      Training: {
        payload: Prisma.$TrainingPayload<ExtArgs>
        fields: Prisma.TrainingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrainingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrainingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>
          }
          findFirst: {
            args: Prisma.TrainingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrainingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>
          }
          findMany: {
            args: Prisma.TrainingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>[]
          }
          create: {
            args: Prisma.TrainingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>
          }
          createMany: {
            args: Prisma.TrainingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrainingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>[]
          }
          delete: {
            args: Prisma.TrainingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>
          }
          update: {
            args: Prisma.TrainingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>
          }
          deleteMany: {
            args: Prisma.TrainingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrainingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrainingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingPayload>
          }
          aggregate: {
            args: Prisma.TrainingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTraining>
          }
          groupBy: {
            args: Prisma.TrainingGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrainingGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrainingCountArgs<ExtArgs>
            result: $Utils.Optional<TrainingCountAggregateOutputType> | number
          }
        }
      }
      TrainingEnrollment: {
        payload: Prisma.$TrainingEnrollmentPayload<ExtArgs>
        fields: Prisma.TrainingEnrollmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrainingEnrollmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrainingEnrollmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>
          }
          findFirst: {
            args: Prisma.TrainingEnrollmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrainingEnrollmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>
          }
          findMany: {
            args: Prisma.TrainingEnrollmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>[]
          }
          create: {
            args: Prisma.TrainingEnrollmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>
          }
          createMany: {
            args: Prisma.TrainingEnrollmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrainingEnrollmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>[]
          }
          delete: {
            args: Prisma.TrainingEnrollmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>
          }
          update: {
            args: Prisma.TrainingEnrollmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>
          }
          deleteMany: {
            args: Prisma.TrainingEnrollmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrainingEnrollmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TrainingEnrollmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrainingEnrollmentPayload>
          }
          aggregate: {
            args: Prisma.TrainingEnrollmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrainingEnrollment>
          }
          groupBy: {
            args: Prisma.TrainingEnrollmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrainingEnrollmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrainingEnrollmentCountArgs<ExtArgs>
            result: $Utils.Optional<TrainingEnrollmentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    employees: number
    positions: number
    children: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | DepartmentCountOutputTypeCountEmployeesArgs
    positions?: boolean | DepartmentCountOutputTypeCountPositionsArgs
    children?: boolean | DepartmentCountOutputTypeCountChildrenArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountEmployeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountPositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PositionWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
  }


  /**
   * Count Type PositionCountOutputType
   */

  export type PositionCountOutputType = {
    employees: number
  }

  export type PositionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | PositionCountOutputTypeCountEmployeesArgs
  }

  // Custom InputTypes
  /**
   * PositionCountOutputType without action
   */
  export type PositionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PositionCountOutputType
     */
    select?: PositionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PositionCountOutputType without action
   */
  export type PositionCountOutputTypeCountEmployeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
  }


  /**
   * Count Type EmployeeCountOutputType
   */

  export type EmployeeCountOutputType = {
    directReports: number
    attendances: number
    shiftAssignments: number
    leaveRequests: number
    payrolls: number
    performances: number
    trainingEnrollments: number
  }

  export type EmployeeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    directReports?: boolean | EmployeeCountOutputTypeCountDirectReportsArgs
    attendances?: boolean | EmployeeCountOutputTypeCountAttendancesArgs
    shiftAssignments?: boolean | EmployeeCountOutputTypeCountShiftAssignmentsArgs
    leaveRequests?: boolean | EmployeeCountOutputTypeCountLeaveRequestsArgs
    payrolls?: boolean | EmployeeCountOutputTypeCountPayrollsArgs
    performances?: boolean | EmployeeCountOutputTypeCountPerformancesArgs
    trainingEnrollments?: boolean | EmployeeCountOutputTypeCountTrainingEnrollmentsArgs
  }

  // Custom InputTypes
  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmployeeCountOutputType
     */
    select?: EmployeeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountDirectReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountAttendancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendanceWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountShiftAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftAssignmentWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountLeaveRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaveRequestWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountPayrollsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayrollWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountPerformancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerformanceReviewWhereInput
  }

  /**
   * EmployeeCountOutputType without action
   */
  export type EmployeeCountOutputTypeCountTrainingEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrainingEnrollmentWhereInput
  }


  /**
   * Count Type ShiftCountOutputType
   */

  export type ShiftCountOutputType = {
    assignments: number
  }

  export type ShiftCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | ShiftCountOutputTypeCountAssignmentsArgs
  }

  // Custom InputTypes
  /**
   * ShiftCountOutputType without action
   */
  export type ShiftCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftCountOutputType
     */
    select?: ShiftCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShiftCountOutputType without action
   */
  export type ShiftCountOutputTypeCountAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftAssignmentWhereInput
  }


  /**
   * Count Type TrainingCountOutputType
   */

  export type TrainingCountOutputType = {
    enrollments: number
  }

  export type TrainingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | TrainingCountOutputTypeCountEnrollmentsArgs
  }

  // Custom InputTypes
  /**
   * TrainingCountOutputType without action
   */
  export type TrainingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingCountOutputType
     */
    select?: TrainingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TrainingCountOutputType without action
   */
  export type TrainingCountOutputTypeCountEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrainingEnrollmentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model HrUser
   */

  export type AggregateHrUser = {
    _count: HrUserCountAggregateOutputType | null
    _min: HrUserMinAggregateOutputType | null
    _max: HrUserMaxAggregateOutputType | null
  }

  export type HrUserMinAggregateOutputType = {
    id: string | null
    tollgateUserId: string | null
    email: string | null
    name: string | null
    role: string | null
    status: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HrUserMaxAggregateOutputType = {
    id: string | null
    tollgateUserId: string | null
    email: string | null
    name: string | null
    role: string | null
    status: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HrUserCountAggregateOutputType = {
    id: number
    tollgateUserId: number
    email: number
    name: number
    role: number
    status: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HrUserMinAggregateInputType = {
    id?: true
    tollgateUserId?: true
    email?: true
    name?: true
    role?: true
    status?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HrUserMaxAggregateInputType = {
    id?: true
    tollgateUserId?: true
    email?: true
    name?: true
    role?: true
    status?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HrUserCountAggregateInputType = {
    id?: true
    tollgateUserId?: true
    email?: true
    name?: true
    role?: true
    status?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HrUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HrUser to aggregate.
     */
    where?: HrUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HrUsers to fetch.
     */
    orderBy?: HrUserOrderByWithRelationInput | HrUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HrUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HrUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HrUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HrUsers
    **/
    _count?: true | HrUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HrUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HrUserMaxAggregateInputType
  }

  export type GetHrUserAggregateType<T extends HrUserAggregateArgs> = {
        [P in keyof T & keyof AggregateHrUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHrUser[P]>
      : GetScalarType<T[P], AggregateHrUser[P]>
  }




  export type HrUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HrUserWhereInput
    orderBy?: HrUserOrderByWithAggregationInput | HrUserOrderByWithAggregationInput[]
    by: HrUserScalarFieldEnum[] | HrUserScalarFieldEnum
    having?: HrUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HrUserCountAggregateInputType | true
    _min?: HrUserMinAggregateInputType
    _max?: HrUserMaxAggregateInputType
  }

  export type HrUserGroupByOutputType = {
    id: string
    tollgateUserId: string
    email: string
    name: string
    role: string
    status: string
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: HrUserCountAggregateOutputType | null
    _min: HrUserMinAggregateOutputType | null
    _max: HrUserMaxAggregateOutputType | null
  }

  type GetHrUserGroupByPayload<T extends HrUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HrUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HrUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HrUserGroupByOutputType[P]>
            : GetScalarType<T[P], HrUserGroupByOutputType[P]>
        }
      >
    >


  export type HrUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tollgateUserId?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hrUser"]>

  export type HrUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tollgateUserId?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hrUser"]>

  export type HrUserSelectScalar = {
    id?: boolean
    tollgateUserId?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $HrUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HrUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tollgateUserId: string
      email: string
      name: string
      role: string
      status: string
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hrUser"]>
    composites: {}
  }

  type HrUserGetPayload<S extends boolean | null | undefined | HrUserDefaultArgs> = $Result.GetResult<Prisma.$HrUserPayload, S>

  type HrUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HrUserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HrUserCountAggregateInputType | true
    }

  export interface HrUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HrUser'], meta: { name: 'HrUser' } }
    /**
     * Find zero or one HrUser that matches the filter.
     * @param {HrUserFindUniqueArgs} args - Arguments to find a HrUser
     * @example
     * // Get one HrUser
     * const hrUser = await prisma.hrUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HrUserFindUniqueArgs>(args: SelectSubset<T, HrUserFindUniqueArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HrUser that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HrUserFindUniqueOrThrowArgs} args - Arguments to find a HrUser
     * @example
     * // Get one HrUser
     * const hrUser = await prisma.hrUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HrUserFindUniqueOrThrowArgs>(args: SelectSubset<T, HrUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HrUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserFindFirstArgs} args - Arguments to find a HrUser
     * @example
     * // Get one HrUser
     * const hrUser = await prisma.hrUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HrUserFindFirstArgs>(args?: SelectSubset<T, HrUserFindFirstArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HrUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserFindFirstOrThrowArgs} args - Arguments to find a HrUser
     * @example
     * // Get one HrUser
     * const hrUser = await prisma.hrUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HrUserFindFirstOrThrowArgs>(args?: SelectSubset<T, HrUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HrUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HrUsers
     * const hrUsers = await prisma.hrUser.findMany()
     * 
     * // Get first 10 HrUsers
     * const hrUsers = await prisma.hrUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hrUserWithIdOnly = await prisma.hrUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HrUserFindManyArgs>(args?: SelectSubset<T, HrUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HrUser.
     * @param {HrUserCreateArgs} args - Arguments to create a HrUser.
     * @example
     * // Create one HrUser
     * const HrUser = await prisma.hrUser.create({
     *   data: {
     *     // ... data to create a HrUser
     *   }
     * })
     * 
     */
    create<T extends HrUserCreateArgs>(args: SelectSubset<T, HrUserCreateArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HrUsers.
     * @param {HrUserCreateManyArgs} args - Arguments to create many HrUsers.
     * @example
     * // Create many HrUsers
     * const hrUser = await prisma.hrUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HrUserCreateManyArgs>(args?: SelectSubset<T, HrUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HrUsers and returns the data saved in the database.
     * @param {HrUserCreateManyAndReturnArgs} args - Arguments to create many HrUsers.
     * @example
     * // Create many HrUsers
     * const hrUser = await prisma.hrUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HrUsers and only return the `id`
     * const hrUserWithIdOnly = await prisma.hrUser.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HrUserCreateManyAndReturnArgs>(args?: SelectSubset<T, HrUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HrUser.
     * @param {HrUserDeleteArgs} args - Arguments to delete one HrUser.
     * @example
     * // Delete one HrUser
     * const HrUser = await prisma.hrUser.delete({
     *   where: {
     *     // ... filter to delete one HrUser
     *   }
     * })
     * 
     */
    delete<T extends HrUserDeleteArgs>(args: SelectSubset<T, HrUserDeleteArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HrUser.
     * @param {HrUserUpdateArgs} args - Arguments to update one HrUser.
     * @example
     * // Update one HrUser
     * const hrUser = await prisma.hrUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HrUserUpdateArgs>(args: SelectSubset<T, HrUserUpdateArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HrUsers.
     * @param {HrUserDeleteManyArgs} args - Arguments to filter HrUsers to delete.
     * @example
     * // Delete a few HrUsers
     * const { count } = await prisma.hrUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HrUserDeleteManyArgs>(args?: SelectSubset<T, HrUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HrUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HrUsers
     * const hrUser = await prisma.hrUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HrUserUpdateManyArgs>(args: SelectSubset<T, HrUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HrUser.
     * @param {HrUserUpsertArgs} args - Arguments to update or create a HrUser.
     * @example
     * // Update or create a HrUser
     * const hrUser = await prisma.hrUser.upsert({
     *   create: {
     *     // ... data to create a HrUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HrUser we want to update
     *   }
     * })
     */
    upsert<T extends HrUserUpsertArgs>(args: SelectSubset<T, HrUserUpsertArgs<ExtArgs>>): Prisma__HrUserClient<$Result.GetResult<Prisma.$HrUserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HrUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserCountArgs} args - Arguments to filter HrUsers to count.
     * @example
     * // Count the number of HrUsers
     * const count = await prisma.hrUser.count({
     *   where: {
     *     // ... the filter for the HrUsers we want to count
     *   }
     * })
    **/
    count<T extends HrUserCountArgs>(
      args?: Subset<T, HrUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HrUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HrUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HrUserAggregateArgs>(args: Subset<T, HrUserAggregateArgs>): Prisma.PrismaPromise<GetHrUserAggregateType<T>>

    /**
     * Group by HrUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HrUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HrUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HrUserGroupByArgs['orderBy'] }
        : { orderBy?: HrUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HrUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHrUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HrUser model
   */
  readonly fields: HrUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HrUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HrUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HrUser model
   */ 
  interface HrUserFieldRefs {
    readonly id: FieldRef<"HrUser", 'String'>
    readonly tollgateUserId: FieldRef<"HrUser", 'String'>
    readonly email: FieldRef<"HrUser", 'String'>
    readonly name: FieldRef<"HrUser", 'String'>
    readonly role: FieldRef<"HrUser", 'String'>
    readonly status: FieldRef<"HrUser", 'String'>
    readonly lastLoginAt: FieldRef<"HrUser", 'DateTime'>
    readonly createdAt: FieldRef<"HrUser", 'DateTime'>
    readonly updatedAt: FieldRef<"HrUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HrUser findUnique
   */
  export type HrUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * Filter, which HrUser to fetch.
     */
    where: HrUserWhereUniqueInput
  }

  /**
   * HrUser findUniqueOrThrow
   */
  export type HrUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * Filter, which HrUser to fetch.
     */
    where: HrUserWhereUniqueInput
  }

  /**
   * HrUser findFirst
   */
  export type HrUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * Filter, which HrUser to fetch.
     */
    where?: HrUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HrUsers to fetch.
     */
    orderBy?: HrUserOrderByWithRelationInput | HrUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HrUsers.
     */
    cursor?: HrUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HrUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HrUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HrUsers.
     */
    distinct?: HrUserScalarFieldEnum | HrUserScalarFieldEnum[]
  }

  /**
   * HrUser findFirstOrThrow
   */
  export type HrUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * Filter, which HrUser to fetch.
     */
    where?: HrUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HrUsers to fetch.
     */
    orderBy?: HrUserOrderByWithRelationInput | HrUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HrUsers.
     */
    cursor?: HrUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HrUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HrUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HrUsers.
     */
    distinct?: HrUserScalarFieldEnum | HrUserScalarFieldEnum[]
  }

  /**
   * HrUser findMany
   */
  export type HrUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * Filter, which HrUsers to fetch.
     */
    where?: HrUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HrUsers to fetch.
     */
    orderBy?: HrUserOrderByWithRelationInput | HrUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HrUsers.
     */
    cursor?: HrUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HrUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HrUsers.
     */
    skip?: number
    distinct?: HrUserScalarFieldEnum | HrUserScalarFieldEnum[]
  }

  /**
   * HrUser create
   */
  export type HrUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * The data needed to create a HrUser.
     */
    data: XOR<HrUserCreateInput, HrUserUncheckedCreateInput>
  }

  /**
   * HrUser createMany
   */
  export type HrUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HrUsers.
     */
    data: HrUserCreateManyInput | HrUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HrUser createManyAndReturn
   */
  export type HrUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HrUsers.
     */
    data: HrUserCreateManyInput | HrUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HrUser update
   */
  export type HrUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * The data needed to update a HrUser.
     */
    data: XOR<HrUserUpdateInput, HrUserUncheckedUpdateInput>
    /**
     * Choose, which HrUser to update.
     */
    where: HrUserWhereUniqueInput
  }

  /**
   * HrUser updateMany
   */
  export type HrUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HrUsers.
     */
    data: XOR<HrUserUpdateManyMutationInput, HrUserUncheckedUpdateManyInput>
    /**
     * Filter which HrUsers to update
     */
    where?: HrUserWhereInput
  }

  /**
   * HrUser upsert
   */
  export type HrUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * The filter to search for the HrUser to update in case it exists.
     */
    where: HrUserWhereUniqueInput
    /**
     * In case the HrUser found by the `where` argument doesn't exist, create a new HrUser with this data.
     */
    create: XOR<HrUserCreateInput, HrUserUncheckedCreateInput>
    /**
     * In case the HrUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HrUserUpdateInput, HrUserUncheckedUpdateInput>
  }

  /**
   * HrUser delete
   */
  export type HrUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
    /**
     * Filter which HrUser to delete.
     */
    where: HrUserWhereUniqueInput
  }

  /**
   * HrUser deleteMany
   */
  export type HrUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HrUsers to delete
     */
    where?: HrUserWhereInput
  }

  /**
   * HrUser without action
   */
  export type HrUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HrUser
     */
    select?: HrUserSelect<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    type: $Enums.DepartmentType | null
    description: string | null
    managerId: string | null
    parentId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    type: $Enums.DepartmentType | null
    description: string | null
    managerId: string | null
    parentId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    name: number
    code: number
    type: number
    description: number
    managerId: number
    parentId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DepartmentMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    type?: true
    description?: true
    managerId?: true
    parentId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    type?: true
    description?: true
    managerId?: true
    parentId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    type?: true
    description?: true
    managerId?: true
    parentId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description: string | null
    managerId: string | null
    parentId: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    type?: boolean
    description?: boolean
    managerId?: boolean
    parentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employees?: boolean | Department$employeesArgs<ExtArgs>
    positions?: boolean | Department$positionsArgs<ExtArgs>
    parent?: boolean | Department$parentArgs<ExtArgs>
    children?: boolean | Department$childrenArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    type?: boolean
    description?: boolean
    managerId?: boolean
    parentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    parent?: boolean | Department$parentArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    type?: boolean
    description?: boolean
    managerId?: boolean
    parentId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | Department$employeesArgs<ExtArgs>
    positions?: boolean | Department$positionsArgs<ExtArgs>
    parent?: boolean | Department$parentArgs<ExtArgs>
    children?: boolean | Department$childrenArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepartmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Department$parentArgs<ExtArgs>
  }

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      employees: Prisma.$EmployeePayload<ExtArgs>[]
      positions: Prisma.$PositionPayload<ExtArgs>[]
      parent: Prisma.$DepartmentPayload<ExtArgs> | null
      children: Prisma.$DepartmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      type: $Enums.DepartmentType
      description: string | null
      managerId: string | null
      parentId: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Departments and returns the data saved in the database.
     * @param {DepartmentCreateManyAndReturnArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employees<T extends Department$employeesArgs<ExtArgs> = {}>(args?: Subset<T, Department$employeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany"> | Null>
    positions<T extends Department$positionsArgs<ExtArgs> = {}>(args?: Subset<T, Department$positionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findMany"> | Null>
    parent<T extends Department$parentArgs<ExtArgs> = {}>(args?: Subset<T, Department$parentArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends Department$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Department$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */ 
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'String'>
    readonly name: FieldRef<"Department", 'String'>
    readonly code: FieldRef<"Department", 'String'>
    readonly type: FieldRef<"Department", 'DepartmentType'>
    readonly description: FieldRef<"Department", 'String'>
    readonly managerId: FieldRef<"Department", 'String'>
    readonly parentId: FieldRef<"Department", 'String'>
    readonly status: FieldRef<"Department", 'String'>
    readonly createdAt: FieldRef<"Department", 'DateTime'>
    readonly updatedAt: FieldRef<"Department", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department createManyAndReturn
   */
  export type DepartmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
  }

  /**
   * Department.employees
   */
  export type Department$employeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    cursor?: EmployeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Department.positions
   */
  export type Department$positionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    where?: PositionWhereInput
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    cursor?: PositionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Department.parent
   */
  export type Department$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
  }

  /**
   * Department.children
   */
  export type Department$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    cursor?: DepartmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model Position
   */

  export type AggregatePosition = {
    _count: PositionCountAggregateOutputType | null
    _avg: PositionAvgAggregateOutputType | null
    _sum: PositionSumAggregateOutputType | null
    _min: PositionMinAggregateOutputType | null
    _max: PositionMaxAggregateOutputType | null
  }

  export type PositionAvgAggregateOutputType = {
    level: number | null
    minSalary: Decimal | null
    maxSalary: Decimal | null
  }

  export type PositionSumAggregateOutputType = {
    level: number | null
    minSalary: Decimal | null
    maxSalary: Decimal | null
  }

  export type PositionMinAggregateOutputType = {
    id: string | null
    title: string | null
    code: string | null
    departmentId: string | null
    level: number | null
    minSalary: Decimal | null
    maxSalary: Decimal | null
    description: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PositionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    code: string | null
    departmentId: string | null
    level: number | null
    minSalary: Decimal | null
    maxSalary: Decimal | null
    description: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PositionCountAggregateOutputType = {
    id: number
    title: number
    code: number
    departmentId: number
    level: number
    minSalary: number
    maxSalary: number
    description: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PositionAvgAggregateInputType = {
    level?: true
    minSalary?: true
    maxSalary?: true
  }

  export type PositionSumAggregateInputType = {
    level?: true
    minSalary?: true
    maxSalary?: true
  }

  export type PositionMinAggregateInputType = {
    id?: true
    title?: true
    code?: true
    departmentId?: true
    level?: true
    minSalary?: true
    maxSalary?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PositionMaxAggregateInputType = {
    id?: true
    title?: true
    code?: true
    departmentId?: true
    level?: true
    minSalary?: true
    maxSalary?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PositionCountAggregateInputType = {
    id?: true
    title?: true
    code?: true
    departmentId?: true
    level?: true
    minSalary?: true
    maxSalary?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PositionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Position to aggregate.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Positions
    **/
    _count?: true | PositionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PositionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PositionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PositionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PositionMaxAggregateInputType
  }

  export type GetPositionAggregateType<T extends PositionAggregateArgs> = {
        [P in keyof T & keyof AggregatePosition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePosition[P]>
      : GetScalarType<T[P], AggregatePosition[P]>
  }




  export type PositionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PositionWhereInput
    orderBy?: PositionOrderByWithAggregationInput | PositionOrderByWithAggregationInput[]
    by: PositionScalarFieldEnum[] | PositionScalarFieldEnum
    having?: PositionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PositionCountAggregateInputType | true
    _avg?: PositionAvgAggregateInputType
    _sum?: PositionSumAggregateInputType
    _min?: PositionMinAggregateInputType
    _max?: PositionMaxAggregateInputType
  }

  export type PositionGroupByOutputType = {
    id: string
    title: string
    code: string
    departmentId: string
    level: number
    minSalary: Decimal | null
    maxSalary: Decimal | null
    description: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: PositionCountAggregateOutputType | null
    _avg: PositionAvgAggregateOutputType | null
    _sum: PositionSumAggregateOutputType | null
    _min: PositionMinAggregateOutputType | null
    _max: PositionMaxAggregateOutputType | null
  }

  type GetPositionGroupByPayload<T extends PositionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PositionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PositionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PositionGroupByOutputType[P]>
            : GetScalarType<T[P], PositionGroupByOutputType[P]>
        }
      >
    >


  export type PositionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    code?: boolean
    departmentId?: boolean
    level?: boolean
    minSalary?: boolean
    maxSalary?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employees?: boolean | Position$employeesArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    _count?: boolean | PositionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["position"]>

  export type PositionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    code?: boolean
    departmentId?: boolean
    level?: boolean
    minSalary?: boolean
    maxSalary?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["position"]>

  export type PositionSelectScalar = {
    id?: boolean
    title?: boolean
    code?: boolean
    departmentId?: boolean
    level?: boolean
    minSalary?: boolean
    maxSalary?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PositionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employees?: boolean | Position$employeesArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    _count?: boolean | PositionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PositionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }

  export type $PositionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Position"
    objects: {
      employees: Prisma.$EmployeePayload<ExtArgs>[]
      department: Prisma.$DepartmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      code: string
      departmentId: string
      level: number
      minSalary: Prisma.Decimal | null
      maxSalary: Prisma.Decimal | null
      description: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["position"]>
    composites: {}
  }

  type PositionGetPayload<S extends boolean | null | undefined | PositionDefaultArgs> = $Result.GetResult<Prisma.$PositionPayload, S>

  type PositionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PositionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PositionCountAggregateInputType | true
    }

  export interface PositionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Position'], meta: { name: 'Position' } }
    /**
     * Find zero or one Position that matches the filter.
     * @param {PositionFindUniqueArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PositionFindUniqueArgs>(args: SelectSubset<T, PositionFindUniqueArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Position that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PositionFindUniqueOrThrowArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PositionFindUniqueOrThrowArgs>(args: SelectSubset<T, PositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Position that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionFindFirstArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PositionFindFirstArgs>(args?: SelectSubset<T, PositionFindFirstArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Position that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionFindFirstOrThrowArgs} args - Arguments to find a Position
     * @example
     * // Get one Position
     * const position = await prisma.position.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PositionFindFirstOrThrowArgs>(args?: SelectSubset<T, PositionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Positions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Positions
     * const positions = await prisma.position.findMany()
     * 
     * // Get first 10 Positions
     * const positions = await prisma.position.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const positionWithIdOnly = await prisma.position.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PositionFindManyArgs>(args?: SelectSubset<T, PositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Position.
     * @param {PositionCreateArgs} args - Arguments to create a Position.
     * @example
     * // Create one Position
     * const Position = await prisma.position.create({
     *   data: {
     *     // ... data to create a Position
     *   }
     * })
     * 
     */
    create<T extends PositionCreateArgs>(args: SelectSubset<T, PositionCreateArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Positions.
     * @param {PositionCreateManyArgs} args - Arguments to create many Positions.
     * @example
     * // Create many Positions
     * const position = await prisma.position.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PositionCreateManyArgs>(args?: SelectSubset<T, PositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Positions and returns the data saved in the database.
     * @param {PositionCreateManyAndReturnArgs} args - Arguments to create many Positions.
     * @example
     * // Create many Positions
     * const position = await prisma.position.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Positions and only return the `id`
     * const positionWithIdOnly = await prisma.position.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PositionCreateManyAndReturnArgs>(args?: SelectSubset<T, PositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Position.
     * @param {PositionDeleteArgs} args - Arguments to delete one Position.
     * @example
     * // Delete one Position
     * const Position = await prisma.position.delete({
     *   where: {
     *     // ... filter to delete one Position
     *   }
     * })
     * 
     */
    delete<T extends PositionDeleteArgs>(args: SelectSubset<T, PositionDeleteArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Position.
     * @param {PositionUpdateArgs} args - Arguments to update one Position.
     * @example
     * // Update one Position
     * const position = await prisma.position.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PositionUpdateArgs>(args: SelectSubset<T, PositionUpdateArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Positions.
     * @param {PositionDeleteManyArgs} args - Arguments to filter Positions to delete.
     * @example
     * // Delete a few Positions
     * const { count } = await prisma.position.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PositionDeleteManyArgs>(args?: SelectSubset<T, PositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Positions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Positions
     * const position = await prisma.position.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PositionUpdateManyArgs>(args: SelectSubset<T, PositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Position.
     * @param {PositionUpsertArgs} args - Arguments to update or create a Position.
     * @example
     * // Update or create a Position
     * const position = await prisma.position.upsert({
     *   create: {
     *     // ... data to create a Position
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Position we want to update
     *   }
     * })
     */
    upsert<T extends PositionUpsertArgs>(args: SelectSubset<T, PositionUpsertArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Positions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionCountArgs} args - Arguments to filter Positions to count.
     * @example
     * // Count the number of Positions
     * const count = await prisma.position.count({
     *   where: {
     *     // ... the filter for the Positions we want to count
     *   }
     * })
    **/
    count<T extends PositionCountArgs>(
      args?: Subset<T, PositionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PositionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Position.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PositionAggregateArgs>(args: Subset<T, PositionAggregateArgs>): Prisma.PrismaPromise<GetPositionAggregateType<T>>

    /**
     * Group by Position.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PositionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PositionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PositionGroupByArgs['orderBy'] }
        : { orderBy?: PositionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Position model
   */
  readonly fields: PositionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Position.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PositionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employees<T extends Position$employeesArgs<ExtArgs> = {}>(args?: Subset<T, Position$employeesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany"> | Null>
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Position model
   */ 
  interface PositionFieldRefs {
    readonly id: FieldRef<"Position", 'String'>
    readonly title: FieldRef<"Position", 'String'>
    readonly code: FieldRef<"Position", 'String'>
    readonly departmentId: FieldRef<"Position", 'String'>
    readonly level: FieldRef<"Position", 'Int'>
    readonly minSalary: FieldRef<"Position", 'Decimal'>
    readonly maxSalary: FieldRef<"Position", 'Decimal'>
    readonly description: FieldRef<"Position", 'String'>
    readonly status: FieldRef<"Position", 'String'>
    readonly createdAt: FieldRef<"Position", 'DateTime'>
    readonly updatedAt: FieldRef<"Position", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Position findUnique
   */
  export type PositionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position findUniqueOrThrow
   */
  export type PositionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position findFirst
   */
  export type PositionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Positions.
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Positions.
     */
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Position findFirstOrThrow
   */
  export type PositionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Position to fetch.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Positions.
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Positions.
     */
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Position findMany
   */
  export type PositionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter, which Positions to fetch.
     */
    where?: PositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Positions to fetch.
     */
    orderBy?: PositionOrderByWithRelationInput | PositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Positions.
     */
    cursor?: PositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Positions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Positions.
     */
    skip?: number
    distinct?: PositionScalarFieldEnum | PositionScalarFieldEnum[]
  }

  /**
   * Position create
   */
  export type PositionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * The data needed to create a Position.
     */
    data: XOR<PositionCreateInput, PositionUncheckedCreateInput>
  }

  /**
   * Position createMany
   */
  export type PositionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Positions.
     */
    data: PositionCreateManyInput | PositionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Position createManyAndReturn
   */
  export type PositionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Positions.
     */
    data: PositionCreateManyInput | PositionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Position update
   */
  export type PositionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * The data needed to update a Position.
     */
    data: XOR<PositionUpdateInput, PositionUncheckedUpdateInput>
    /**
     * Choose, which Position to update.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position updateMany
   */
  export type PositionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Positions.
     */
    data: XOR<PositionUpdateManyMutationInput, PositionUncheckedUpdateManyInput>
    /**
     * Filter which Positions to update
     */
    where?: PositionWhereInput
  }

  /**
   * Position upsert
   */
  export type PositionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * The filter to search for the Position to update in case it exists.
     */
    where: PositionWhereUniqueInput
    /**
     * In case the Position found by the `where` argument doesn't exist, create a new Position with this data.
     */
    create: XOR<PositionCreateInput, PositionUncheckedCreateInput>
    /**
     * In case the Position was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PositionUpdateInput, PositionUncheckedUpdateInput>
  }

  /**
   * Position delete
   */
  export type PositionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
    /**
     * Filter which Position to delete.
     */
    where: PositionWhereUniqueInput
  }

  /**
   * Position deleteMany
   */
  export type PositionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Positions to delete
     */
    where?: PositionWhereInput
  }

  /**
   * Position.employees
   */
  export type Position$employeesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    cursor?: EmployeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Position without action
   */
  export type PositionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Position
     */
    select?: PositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PositionInclude<ExtArgs> | null
  }


  /**
   * Model Employee
   */

  export type AggregateEmployee = {
    _count: EmployeeCountAggregateOutputType | null
    _avg: EmployeeAvgAggregateOutputType | null
    _sum: EmployeeSumAggregateOutputType | null
    _min: EmployeeMinAggregateOutputType | null
    _max: EmployeeMaxAggregateOutputType | null
  }

  export type EmployeeAvgAggregateOutputType = {
    salary: Decimal | null
  }

  export type EmployeeSumAggregateOutputType = {
    salary: Decimal | null
  }

  export type EmployeeMinAggregateOutputType = {
    id: string | null
    employeeNumber: string | null
    tollgateUserId: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    nrcNumber: string | null
    dateOfBirth: Date | null
    gender: string | null
    address: string | null
    emergencyContact: string | null
    emergencyPhone: string | null
    departmentId: string | null
    positionId: string | null
    managerId: string | null
    hireDate: Date | null
    salary: Decimal | null
    status: $Enums.EmployeeStatus | null
    terminationDate: Date | null
    profilePhoto: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmployeeMaxAggregateOutputType = {
    id: string | null
    employeeNumber: string | null
    tollgateUserId: string | null
    firstName: string | null
    lastName: string | null
    email: string | null
    phone: string | null
    nrcNumber: string | null
    dateOfBirth: Date | null
    gender: string | null
    address: string | null
    emergencyContact: string | null
    emergencyPhone: string | null
    departmentId: string | null
    positionId: string | null
    managerId: string | null
    hireDate: Date | null
    salary: Decimal | null
    status: $Enums.EmployeeStatus | null
    terminationDate: Date | null
    profilePhoto: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmployeeCountAggregateOutputType = {
    id: number
    employeeNumber: number
    tollgateUserId: number
    firstName: number
    lastName: number
    email: number
    phone: number
    nrcNumber: number
    dateOfBirth: number
    gender: number
    address: number
    emergencyContact: number
    emergencyPhone: number
    departmentId: number
    positionId: number
    managerId: number
    hireDate: number
    salary: number
    status: number
    terminationDate: number
    profilePhoto: number
    notes: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EmployeeAvgAggregateInputType = {
    salary?: true
  }

  export type EmployeeSumAggregateInputType = {
    salary?: true
  }

  export type EmployeeMinAggregateInputType = {
    id?: true
    employeeNumber?: true
    tollgateUserId?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    nrcNumber?: true
    dateOfBirth?: true
    gender?: true
    address?: true
    emergencyContact?: true
    emergencyPhone?: true
    departmentId?: true
    positionId?: true
    managerId?: true
    hireDate?: true
    salary?: true
    status?: true
    terminationDate?: true
    profilePhoto?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmployeeMaxAggregateInputType = {
    id?: true
    employeeNumber?: true
    tollgateUserId?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    nrcNumber?: true
    dateOfBirth?: true
    gender?: true
    address?: true
    emergencyContact?: true
    emergencyPhone?: true
    departmentId?: true
    positionId?: true
    managerId?: true
    hireDate?: true
    salary?: true
    status?: true
    terminationDate?: true
    profilePhoto?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmployeeCountAggregateInputType = {
    id?: true
    employeeNumber?: true
    tollgateUserId?: true
    firstName?: true
    lastName?: true
    email?: true
    phone?: true
    nrcNumber?: true
    dateOfBirth?: true
    gender?: true
    address?: true
    emergencyContact?: true
    emergencyPhone?: true
    departmentId?: true
    positionId?: true
    managerId?: true
    hireDate?: true
    salary?: true
    status?: true
    terminationDate?: true
    profilePhoto?: true
    notes?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EmployeeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Employee to aggregate.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Employees
    **/
    _count?: true | EmployeeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmployeeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmployeeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmployeeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmployeeMaxAggregateInputType
  }

  export type GetEmployeeAggregateType<T extends EmployeeAggregateArgs> = {
        [P in keyof T & keyof AggregateEmployee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmployee[P]>
      : GetScalarType<T[P], AggregateEmployee[P]>
  }




  export type EmployeeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithAggregationInput | EmployeeOrderByWithAggregationInput[]
    by: EmployeeScalarFieldEnum[] | EmployeeScalarFieldEnum
    having?: EmployeeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmployeeCountAggregateInputType | true
    _avg?: EmployeeAvgAggregateInputType
    _sum?: EmployeeSumAggregateInputType
    _min?: EmployeeMinAggregateInputType
    _max?: EmployeeMaxAggregateInputType
  }

  export type EmployeeGroupByOutputType = {
    id: string
    employeeNumber: string
    tollgateUserId: string | null
    firstName: string
    lastName: string
    email: string
    phone: string | null
    nrcNumber: string | null
    dateOfBirth: Date | null
    gender: string | null
    address: string | null
    emergencyContact: string | null
    emergencyPhone: string | null
    departmentId: string
    positionId: string
    managerId: string | null
    hireDate: Date
    salary: Decimal
    status: $Enums.EmployeeStatus
    terminationDate: Date | null
    profilePhoto: string | null
    notes: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: EmployeeCountAggregateOutputType | null
    _avg: EmployeeAvgAggregateOutputType | null
    _sum: EmployeeSumAggregateOutputType | null
    _min: EmployeeMinAggregateOutputType | null
    _max: EmployeeMaxAggregateOutputType | null
  }

  type GetEmployeeGroupByPayload<T extends EmployeeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmployeeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmployeeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmployeeGroupByOutputType[P]>
            : GetScalarType<T[P], EmployeeGroupByOutputType[P]>
        }
      >
    >


  export type EmployeeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeNumber?: boolean
    tollgateUserId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    nrcNumber?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    emergencyContact?: boolean
    emergencyPhone?: boolean
    departmentId?: boolean
    positionId?: boolean
    managerId?: boolean
    hireDate?: boolean
    salary?: boolean
    status?: boolean
    terminationDate?: boolean
    profilePhoto?: boolean
    notes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    position?: boolean | PositionDefaultArgs<ExtArgs>
    manager?: boolean | Employee$managerArgs<ExtArgs>
    directReports?: boolean | Employee$directReportsArgs<ExtArgs>
    attendances?: boolean | Employee$attendancesArgs<ExtArgs>
    shiftAssignments?: boolean | Employee$shiftAssignmentsArgs<ExtArgs>
    leaveRequests?: boolean | Employee$leaveRequestsArgs<ExtArgs>
    payrolls?: boolean | Employee$payrollsArgs<ExtArgs>
    performances?: boolean | Employee$performancesArgs<ExtArgs>
    trainingEnrollments?: boolean | Employee$trainingEnrollmentsArgs<ExtArgs>
    _count?: boolean | EmployeeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["employee"]>

  export type EmployeeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeNumber?: boolean
    tollgateUserId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    nrcNumber?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    emergencyContact?: boolean
    emergencyPhone?: boolean
    departmentId?: boolean
    positionId?: boolean
    managerId?: boolean
    hireDate?: boolean
    salary?: boolean
    status?: boolean
    terminationDate?: boolean
    profilePhoto?: boolean
    notes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    position?: boolean | PositionDefaultArgs<ExtArgs>
    manager?: boolean | Employee$managerArgs<ExtArgs>
  }, ExtArgs["result"]["employee"]>

  export type EmployeeSelectScalar = {
    id?: boolean
    employeeNumber?: boolean
    tollgateUserId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    nrcNumber?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    emergencyContact?: boolean
    emergencyPhone?: boolean
    departmentId?: boolean
    positionId?: boolean
    managerId?: boolean
    hireDate?: boolean
    salary?: boolean
    status?: boolean
    terminationDate?: boolean
    profilePhoto?: boolean
    notes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EmployeeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    position?: boolean | PositionDefaultArgs<ExtArgs>
    manager?: boolean | Employee$managerArgs<ExtArgs>
    directReports?: boolean | Employee$directReportsArgs<ExtArgs>
    attendances?: boolean | Employee$attendancesArgs<ExtArgs>
    shiftAssignments?: boolean | Employee$shiftAssignmentsArgs<ExtArgs>
    leaveRequests?: boolean | Employee$leaveRequestsArgs<ExtArgs>
    payrolls?: boolean | Employee$payrollsArgs<ExtArgs>
    performances?: boolean | Employee$performancesArgs<ExtArgs>
    trainingEnrollments?: boolean | Employee$trainingEnrollmentsArgs<ExtArgs>
    _count?: boolean | EmployeeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EmployeeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    position?: boolean | PositionDefaultArgs<ExtArgs>
    manager?: boolean | Employee$managerArgs<ExtArgs>
  }

  export type $EmployeePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Employee"
    objects: {
      department: Prisma.$DepartmentPayload<ExtArgs>
      position: Prisma.$PositionPayload<ExtArgs>
      manager: Prisma.$EmployeePayload<ExtArgs> | null
      directReports: Prisma.$EmployeePayload<ExtArgs>[]
      attendances: Prisma.$AttendancePayload<ExtArgs>[]
      shiftAssignments: Prisma.$ShiftAssignmentPayload<ExtArgs>[]
      leaveRequests: Prisma.$LeaveRequestPayload<ExtArgs>[]
      payrolls: Prisma.$PayrollPayload<ExtArgs>[]
      performances: Prisma.$PerformanceReviewPayload<ExtArgs>[]
      trainingEnrollments: Prisma.$TrainingEnrollmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeNumber: string
      tollgateUserId: string | null
      firstName: string
      lastName: string
      email: string
      phone: string | null
      nrcNumber: string | null
      dateOfBirth: Date | null
      gender: string | null
      address: string | null
      emergencyContact: string | null
      emergencyPhone: string | null
      departmentId: string
      positionId: string
      managerId: string | null
      hireDate: Date
      salary: Prisma.Decimal
      status: $Enums.EmployeeStatus
      terminationDate: Date | null
      profilePhoto: string | null
      notes: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["employee"]>
    composites: {}
  }

  type EmployeeGetPayload<S extends boolean | null | undefined | EmployeeDefaultArgs> = $Result.GetResult<Prisma.$EmployeePayload, S>

  type EmployeeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmployeeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmployeeCountAggregateInputType | true
    }

  export interface EmployeeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Employee'], meta: { name: 'Employee' } }
    /**
     * Find zero or one Employee that matches the filter.
     * @param {EmployeeFindUniqueArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmployeeFindUniqueArgs>(args: SelectSubset<T, EmployeeFindUniqueArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Employee that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmployeeFindUniqueOrThrowArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmployeeFindUniqueOrThrowArgs>(args: SelectSubset<T, EmployeeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Employee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindFirstArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmployeeFindFirstArgs>(args?: SelectSubset<T, EmployeeFindFirstArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Employee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindFirstOrThrowArgs} args - Arguments to find a Employee
     * @example
     * // Get one Employee
     * const employee = await prisma.employee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmployeeFindFirstOrThrowArgs>(args?: SelectSubset<T, EmployeeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Employees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Employees
     * const employees = await prisma.employee.findMany()
     * 
     * // Get first 10 Employees
     * const employees = await prisma.employee.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const employeeWithIdOnly = await prisma.employee.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmployeeFindManyArgs>(args?: SelectSubset<T, EmployeeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Employee.
     * @param {EmployeeCreateArgs} args - Arguments to create a Employee.
     * @example
     * // Create one Employee
     * const Employee = await prisma.employee.create({
     *   data: {
     *     // ... data to create a Employee
     *   }
     * })
     * 
     */
    create<T extends EmployeeCreateArgs>(args: SelectSubset<T, EmployeeCreateArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Employees.
     * @param {EmployeeCreateManyArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employee = await prisma.employee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmployeeCreateManyArgs>(args?: SelectSubset<T, EmployeeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Employees and returns the data saved in the database.
     * @param {EmployeeCreateManyAndReturnArgs} args - Arguments to create many Employees.
     * @example
     * // Create many Employees
     * const employee = await prisma.employee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Employees and only return the `id`
     * const employeeWithIdOnly = await prisma.employee.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmployeeCreateManyAndReturnArgs>(args?: SelectSubset<T, EmployeeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Employee.
     * @param {EmployeeDeleteArgs} args - Arguments to delete one Employee.
     * @example
     * // Delete one Employee
     * const Employee = await prisma.employee.delete({
     *   where: {
     *     // ... filter to delete one Employee
     *   }
     * })
     * 
     */
    delete<T extends EmployeeDeleteArgs>(args: SelectSubset<T, EmployeeDeleteArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Employee.
     * @param {EmployeeUpdateArgs} args - Arguments to update one Employee.
     * @example
     * // Update one Employee
     * const employee = await prisma.employee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmployeeUpdateArgs>(args: SelectSubset<T, EmployeeUpdateArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Employees.
     * @param {EmployeeDeleteManyArgs} args - Arguments to filter Employees to delete.
     * @example
     * // Delete a few Employees
     * const { count } = await prisma.employee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmployeeDeleteManyArgs>(args?: SelectSubset<T, EmployeeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Employees
     * const employee = await prisma.employee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmployeeUpdateManyArgs>(args: SelectSubset<T, EmployeeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Employee.
     * @param {EmployeeUpsertArgs} args - Arguments to update or create a Employee.
     * @example
     * // Update or create a Employee
     * const employee = await prisma.employee.upsert({
     *   create: {
     *     // ... data to create a Employee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Employee we want to update
     *   }
     * })
     */
    upsert<T extends EmployeeUpsertArgs>(args: SelectSubset<T, EmployeeUpsertArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Employees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeCountArgs} args - Arguments to filter Employees to count.
     * @example
     * // Count the number of Employees
     * const count = await prisma.employee.count({
     *   where: {
     *     // ... the filter for the Employees we want to count
     *   }
     * })
    **/
    count<T extends EmployeeCountArgs>(
      args?: Subset<T, EmployeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmployeeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Employee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmployeeAggregateArgs>(args: Subset<T, EmployeeAggregateArgs>): Prisma.PrismaPromise<GetEmployeeAggregateType<T>>

    /**
     * Group by Employee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmployeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmployeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmployeeGroupByArgs['orderBy'] }
        : { orderBy?: EmployeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmployeeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmployeeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Employee model
   */
  readonly fields: EmployeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Employee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmployeeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    position<T extends PositionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PositionDefaultArgs<ExtArgs>>): Prisma__PositionClient<$Result.GetResult<Prisma.$PositionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    manager<T extends Employee$managerArgs<ExtArgs> = {}>(args?: Subset<T, Employee$managerArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    directReports<T extends Employee$directReportsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$directReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findMany"> | Null>
    attendances<T extends Employee$attendancesArgs<ExtArgs> = {}>(args?: Subset<T, Employee$attendancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findMany"> | Null>
    shiftAssignments<T extends Employee$shiftAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$shiftAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
    leaveRequests<T extends Employee$leaveRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$leaveRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "findMany"> | Null>
    payrolls<T extends Employee$payrollsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$payrollsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "findMany"> | Null>
    performances<T extends Employee$performancesArgs<ExtArgs> = {}>(args?: Subset<T, Employee$performancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "findMany"> | Null>
    trainingEnrollments<T extends Employee$trainingEnrollmentsArgs<ExtArgs> = {}>(args?: Subset<T, Employee$trainingEnrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Employee model
   */ 
  interface EmployeeFieldRefs {
    readonly id: FieldRef<"Employee", 'String'>
    readonly employeeNumber: FieldRef<"Employee", 'String'>
    readonly tollgateUserId: FieldRef<"Employee", 'String'>
    readonly firstName: FieldRef<"Employee", 'String'>
    readonly lastName: FieldRef<"Employee", 'String'>
    readonly email: FieldRef<"Employee", 'String'>
    readonly phone: FieldRef<"Employee", 'String'>
    readonly nrcNumber: FieldRef<"Employee", 'String'>
    readonly dateOfBirth: FieldRef<"Employee", 'DateTime'>
    readonly gender: FieldRef<"Employee", 'String'>
    readonly address: FieldRef<"Employee", 'String'>
    readonly emergencyContact: FieldRef<"Employee", 'String'>
    readonly emergencyPhone: FieldRef<"Employee", 'String'>
    readonly departmentId: FieldRef<"Employee", 'String'>
    readonly positionId: FieldRef<"Employee", 'String'>
    readonly managerId: FieldRef<"Employee", 'String'>
    readonly hireDate: FieldRef<"Employee", 'DateTime'>
    readonly salary: FieldRef<"Employee", 'Decimal'>
    readonly status: FieldRef<"Employee", 'EmployeeStatus'>
    readonly terminationDate: FieldRef<"Employee", 'DateTime'>
    readonly profilePhoto: FieldRef<"Employee", 'String'>
    readonly notes: FieldRef<"Employee", 'String'>
    readonly metadata: FieldRef<"Employee", 'Json'>
    readonly createdAt: FieldRef<"Employee", 'DateTime'>
    readonly updatedAt: FieldRef<"Employee", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Employee findUnique
   */
  export type EmployeeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee findUniqueOrThrow
   */
  export type EmployeeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee findFirst
   */
  export type EmployeeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Employees.
     */
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee findFirstOrThrow
   */
  export type EmployeeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employee to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Employees.
     */
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee findMany
   */
  export type EmployeeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter, which Employees to fetch.
     */
    where?: EmployeeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Employees to fetch.
     */
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Employees.
     */
    cursor?: EmployeeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Employees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Employees.
     */
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee create
   */
  export type EmployeeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * The data needed to create a Employee.
     */
    data: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>
  }

  /**
   * Employee createMany
   */
  export type EmployeeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Employees.
     */
    data: EmployeeCreateManyInput | EmployeeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Employee createManyAndReturn
   */
  export type EmployeeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Employees.
     */
    data: EmployeeCreateManyInput | EmployeeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Employee update
   */
  export type EmployeeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * The data needed to update a Employee.
     */
    data: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>
    /**
     * Choose, which Employee to update.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee updateMany
   */
  export type EmployeeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Employees.
     */
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyInput>
    /**
     * Filter which Employees to update
     */
    where?: EmployeeWhereInput
  }

  /**
   * Employee upsert
   */
  export type EmployeeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * The filter to search for the Employee to update in case it exists.
     */
    where: EmployeeWhereUniqueInput
    /**
     * In case the Employee found by the `where` argument doesn't exist, create a new Employee with this data.
     */
    create: XOR<EmployeeCreateInput, EmployeeUncheckedCreateInput>
    /**
     * In case the Employee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmployeeUpdateInput, EmployeeUncheckedUpdateInput>
  }

  /**
   * Employee delete
   */
  export type EmployeeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    /**
     * Filter which Employee to delete.
     */
    where: EmployeeWhereUniqueInput
  }

  /**
   * Employee deleteMany
   */
  export type EmployeeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Employees to delete
     */
    where?: EmployeeWhereInput
  }

  /**
   * Employee.manager
   */
  export type Employee$managerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    where?: EmployeeWhereInput
  }

  /**
   * Employee.directReports
   */
  export type Employee$directReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
    where?: EmployeeWhereInput
    orderBy?: EmployeeOrderByWithRelationInput | EmployeeOrderByWithRelationInput[]
    cursor?: EmployeeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmployeeScalarFieldEnum | EmployeeScalarFieldEnum[]
  }

  /**
   * Employee.attendances
   */
  export type Employee$attendancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    where?: AttendanceWhereInput
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    cursor?: AttendanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Employee.shiftAssignments
   */
  export type Employee$shiftAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    where?: ShiftAssignmentWhereInput
    orderBy?: ShiftAssignmentOrderByWithRelationInput | ShiftAssignmentOrderByWithRelationInput[]
    cursor?: ShiftAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShiftAssignmentScalarFieldEnum | ShiftAssignmentScalarFieldEnum[]
  }

  /**
   * Employee.leaveRequests
   */
  export type Employee$leaveRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    where?: LeaveRequestWhereInput
    orderBy?: LeaveRequestOrderByWithRelationInput | LeaveRequestOrderByWithRelationInput[]
    cursor?: LeaveRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeaveRequestScalarFieldEnum | LeaveRequestScalarFieldEnum[]
  }

  /**
   * Employee.payrolls
   */
  export type Employee$payrollsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    where?: PayrollWhereInput
    orderBy?: PayrollOrderByWithRelationInput | PayrollOrderByWithRelationInput[]
    cursor?: PayrollWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PayrollScalarFieldEnum | PayrollScalarFieldEnum[]
  }

  /**
   * Employee.performances
   */
  export type Employee$performancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    where?: PerformanceReviewWhereInput
    orderBy?: PerformanceReviewOrderByWithRelationInput | PerformanceReviewOrderByWithRelationInput[]
    cursor?: PerformanceReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PerformanceReviewScalarFieldEnum | PerformanceReviewScalarFieldEnum[]
  }

  /**
   * Employee.trainingEnrollments
   */
  export type Employee$trainingEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    where?: TrainingEnrollmentWhereInput
    orderBy?: TrainingEnrollmentOrderByWithRelationInput | TrainingEnrollmentOrderByWithRelationInput[]
    cursor?: TrainingEnrollmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrainingEnrollmentScalarFieldEnum | TrainingEnrollmentScalarFieldEnum[]
  }

  /**
   * Employee without action
   */
  export type EmployeeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Employee
     */
    select?: EmployeeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmployeeInclude<ExtArgs> | null
  }


  /**
   * Model Attendance
   */

  export type AggregateAttendance = {
    _count: AttendanceCountAggregateOutputType | null
    _avg: AttendanceAvgAggregateOutputType | null
    _sum: AttendanceSumAggregateOutputType | null
    _min: AttendanceMinAggregateOutputType | null
    _max: AttendanceMaxAggregateOutputType | null
  }

  export type AttendanceAvgAggregateOutputType = {
    hoursWorked: Decimal | null
    overtime: Decimal | null
  }

  export type AttendanceSumAggregateOutputType = {
    hoursWorked: Decimal | null
    overtime: Decimal | null
  }

  export type AttendanceMinAggregateOutputType = {
    id: string | null
    employeeId: string | null
    date: Date | null
    clockIn: Date | null
    clockOut: Date | null
    status: $Enums.AttendanceStatus | null
    hoursWorked: Decimal | null
    overtime: Decimal | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AttendanceMaxAggregateOutputType = {
    id: string | null
    employeeId: string | null
    date: Date | null
    clockIn: Date | null
    clockOut: Date | null
    status: $Enums.AttendanceStatus | null
    hoursWorked: Decimal | null
    overtime: Decimal | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AttendanceCountAggregateOutputType = {
    id: number
    employeeId: number
    date: number
    clockIn: number
    clockOut: number
    status: number
    hoursWorked: number
    overtime: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AttendanceAvgAggregateInputType = {
    hoursWorked?: true
    overtime?: true
  }

  export type AttendanceSumAggregateInputType = {
    hoursWorked?: true
    overtime?: true
  }

  export type AttendanceMinAggregateInputType = {
    id?: true
    employeeId?: true
    date?: true
    clockIn?: true
    clockOut?: true
    status?: true
    hoursWorked?: true
    overtime?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AttendanceMaxAggregateInputType = {
    id?: true
    employeeId?: true
    date?: true
    clockIn?: true
    clockOut?: true
    status?: true
    hoursWorked?: true
    overtime?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AttendanceCountAggregateInputType = {
    id?: true
    employeeId?: true
    date?: true
    clockIn?: true
    clockOut?: true
    status?: true
    hoursWorked?: true
    overtime?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AttendanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attendance to aggregate.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Attendances
    **/
    _count?: true | AttendanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AttendanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AttendanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttendanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttendanceMaxAggregateInputType
  }

  export type GetAttendanceAggregateType<T extends AttendanceAggregateArgs> = {
        [P in keyof T & keyof AggregateAttendance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttendance[P]>
      : GetScalarType<T[P], AggregateAttendance[P]>
  }




  export type AttendanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendanceWhereInput
    orderBy?: AttendanceOrderByWithAggregationInput | AttendanceOrderByWithAggregationInput[]
    by: AttendanceScalarFieldEnum[] | AttendanceScalarFieldEnum
    having?: AttendanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttendanceCountAggregateInputType | true
    _avg?: AttendanceAvgAggregateInputType
    _sum?: AttendanceSumAggregateInputType
    _min?: AttendanceMinAggregateInputType
    _max?: AttendanceMaxAggregateInputType
  }

  export type AttendanceGroupByOutputType = {
    id: string
    employeeId: string
    date: Date
    clockIn: Date | null
    clockOut: Date | null
    status: $Enums.AttendanceStatus
    hoursWorked: Decimal | null
    overtime: Decimal | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AttendanceCountAggregateOutputType | null
    _avg: AttendanceAvgAggregateOutputType | null
    _sum: AttendanceSumAggregateOutputType | null
    _min: AttendanceMinAggregateOutputType | null
    _max: AttendanceMaxAggregateOutputType | null
  }

  type GetAttendanceGroupByPayload<T extends AttendanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttendanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttendanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttendanceGroupByOutputType[P]>
            : GetScalarType<T[P], AttendanceGroupByOutputType[P]>
        }
      >
    >


  export type AttendanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    date?: boolean
    clockIn?: boolean
    clockOut?: boolean
    status?: boolean
    hoursWorked?: boolean
    overtime?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attendance"]>

  export type AttendanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    date?: boolean
    clockIn?: boolean
    clockOut?: boolean
    status?: boolean
    hoursWorked?: boolean
    overtime?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attendance"]>

  export type AttendanceSelectScalar = {
    id?: boolean
    employeeId?: boolean
    date?: boolean
    clockIn?: boolean
    clockOut?: boolean
    status?: boolean
    hoursWorked?: boolean
    overtime?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AttendanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type AttendanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }

  export type $AttendancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Attendance"
    objects: {
      employee: Prisma.$EmployeePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeId: string
      date: Date
      clockIn: Date | null
      clockOut: Date | null
      status: $Enums.AttendanceStatus
      hoursWorked: Prisma.Decimal | null
      overtime: Prisma.Decimal | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["attendance"]>
    composites: {}
  }

  type AttendanceGetPayload<S extends boolean | null | undefined | AttendanceDefaultArgs> = $Result.GetResult<Prisma.$AttendancePayload, S>

  type AttendanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AttendanceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AttendanceCountAggregateInputType | true
    }

  export interface AttendanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Attendance'], meta: { name: 'Attendance' } }
    /**
     * Find zero or one Attendance that matches the filter.
     * @param {AttendanceFindUniqueArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttendanceFindUniqueArgs>(args: SelectSubset<T, AttendanceFindUniqueArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Attendance that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AttendanceFindUniqueOrThrowArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttendanceFindUniqueOrThrowArgs>(args: SelectSubset<T, AttendanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Attendance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceFindFirstArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttendanceFindFirstArgs>(args?: SelectSubset<T, AttendanceFindFirstArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Attendance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceFindFirstOrThrowArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttendanceFindFirstOrThrowArgs>(args?: SelectSubset<T, AttendanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Attendances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attendances
     * const attendances = await prisma.attendance.findMany()
     * 
     * // Get first 10 Attendances
     * const attendances = await prisma.attendance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attendanceWithIdOnly = await prisma.attendance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AttendanceFindManyArgs>(args?: SelectSubset<T, AttendanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Attendance.
     * @param {AttendanceCreateArgs} args - Arguments to create a Attendance.
     * @example
     * // Create one Attendance
     * const Attendance = await prisma.attendance.create({
     *   data: {
     *     // ... data to create a Attendance
     *   }
     * })
     * 
     */
    create<T extends AttendanceCreateArgs>(args: SelectSubset<T, AttendanceCreateArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Attendances.
     * @param {AttendanceCreateManyArgs} args - Arguments to create many Attendances.
     * @example
     * // Create many Attendances
     * const attendance = await prisma.attendance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AttendanceCreateManyArgs>(args?: SelectSubset<T, AttendanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attendances and returns the data saved in the database.
     * @param {AttendanceCreateManyAndReturnArgs} args - Arguments to create many Attendances.
     * @example
     * // Create many Attendances
     * const attendance = await prisma.attendance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attendances and only return the `id`
     * const attendanceWithIdOnly = await prisma.attendance.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AttendanceCreateManyAndReturnArgs>(args?: SelectSubset<T, AttendanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Attendance.
     * @param {AttendanceDeleteArgs} args - Arguments to delete one Attendance.
     * @example
     * // Delete one Attendance
     * const Attendance = await prisma.attendance.delete({
     *   where: {
     *     // ... filter to delete one Attendance
     *   }
     * })
     * 
     */
    delete<T extends AttendanceDeleteArgs>(args: SelectSubset<T, AttendanceDeleteArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Attendance.
     * @param {AttendanceUpdateArgs} args - Arguments to update one Attendance.
     * @example
     * // Update one Attendance
     * const attendance = await prisma.attendance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AttendanceUpdateArgs>(args: SelectSubset<T, AttendanceUpdateArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Attendances.
     * @param {AttendanceDeleteManyArgs} args - Arguments to filter Attendances to delete.
     * @example
     * // Delete a few Attendances
     * const { count } = await prisma.attendance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AttendanceDeleteManyArgs>(args?: SelectSubset<T, AttendanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attendances
     * const attendance = await prisma.attendance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AttendanceUpdateManyArgs>(args: SelectSubset<T, AttendanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Attendance.
     * @param {AttendanceUpsertArgs} args - Arguments to update or create a Attendance.
     * @example
     * // Update or create a Attendance
     * const attendance = await prisma.attendance.upsert({
     *   create: {
     *     // ... data to create a Attendance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attendance we want to update
     *   }
     * })
     */
    upsert<T extends AttendanceUpsertArgs>(args: SelectSubset<T, AttendanceUpsertArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Attendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceCountArgs} args - Arguments to filter Attendances to count.
     * @example
     * // Count the number of Attendances
     * const count = await prisma.attendance.count({
     *   where: {
     *     // ... the filter for the Attendances we want to count
     *   }
     * })
    **/
    count<T extends AttendanceCountArgs>(
      args?: Subset<T, AttendanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttendanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AttendanceAggregateArgs>(args: Subset<T, AttendanceAggregateArgs>): Prisma.PrismaPromise<GetAttendanceAggregateType<T>>

    /**
     * Group by Attendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AttendanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttendanceGroupByArgs['orderBy'] }
        : { orderBy?: AttendanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AttendanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttendanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Attendance model
   */
  readonly fields: AttendanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attendance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttendanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Attendance model
   */ 
  interface AttendanceFieldRefs {
    readonly id: FieldRef<"Attendance", 'String'>
    readonly employeeId: FieldRef<"Attendance", 'String'>
    readonly date: FieldRef<"Attendance", 'DateTime'>
    readonly clockIn: FieldRef<"Attendance", 'DateTime'>
    readonly clockOut: FieldRef<"Attendance", 'DateTime'>
    readonly status: FieldRef<"Attendance", 'AttendanceStatus'>
    readonly hoursWorked: FieldRef<"Attendance", 'Decimal'>
    readonly overtime: FieldRef<"Attendance", 'Decimal'>
    readonly notes: FieldRef<"Attendance", 'String'>
    readonly createdAt: FieldRef<"Attendance", 'DateTime'>
    readonly updatedAt: FieldRef<"Attendance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Attendance findUnique
   */
  export type AttendanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance findUniqueOrThrow
   */
  export type AttendanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance findFirst
   */
  export type AttendanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attendances.
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attendances.
     */
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Attendance findFirstOrThrow
   */
  export type AttendanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attendances.
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attendances.
     */
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Attendance findMany
   */
  export type AttendanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendances to fetch.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Attendances.
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Attendance create
   */
  export type AttendanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * The data needed to create a Attendance.
     */
    data: XOR<AttendanceCreateInput, AttendanceUncheckedCreateInput>
  }

  /**
   * Attendance createMany
   */
  export type AttendanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Attendances.
     */
    data: AttendanceCreateManyInput | AttendanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Attendance createManyAndReturn
   */
  export type AttendanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Attendances.
     */
    data: AttendanceCreateManyInput | AttendanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Attendance update
   */
  export type AttendanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * The data needed to update a Attendance.
     */
    data: XOR<AttendanceUpdateInput, AttendanceUncheckedUpdateInput>
    /**
     * Choose, which Attendance to update.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance updateMany
   */
  export type AttendanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Attendances.
     */
    data: XOR<AttendanceUpdateManyMutationInput, AttendanceUncheckedUpdateManyInput>
    /**
     * Filter which Attendances to update
     */
    where?: AttendanceWhereInput
  }

  /**
   * Attendance upsert
   */
  export type AttendanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * The filter to search for the Attendance to update in case it exists.
     */
    where: AttendanceWhereUniqueInput
    /**
     * In case the Attendance found by the `where` argument doesn't exist, create a new Attendance with this data.
     */
    create: XOR<AttendanceCreateInput, AttendanceUncheckedCreateInput>
    /**
     * In case the Attendance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttendanceUpdateInput, AttendanceUncheckedUpdateInput>
  }

  /**
   * Attendance delete
   */
  export type AttendanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter which Attendance to delete.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance deleteMany
   */
  export type AttendanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attendances to delete
     */
    where?: AttendanceWhereInput
  }

  /**
   * Attendance without action
   */
  export type AttendanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
  }


  /**
   * Model Shift
   */

  export type AggregateShift = {
    _count: ShiftCountAggregateOutputType | null
    _avg: ShiftAvgAggregateOutputType | null
    _sum: ShiftSumAggregateOutputType | null
    _min: ShiftMinAggregateOutputType | null
    _max: ShiftMaxAggregateOutputType | null
  }

  export type ShiftAvgAggregateOutputType = {
    breakMins: number | null
  }

  export type ShiftSumAggregateOutputType = {
    breakMins: number | null
  }

  export type ShiftMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    startTime: string | null
    endTime: string | null
    breakMins: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShiftMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    startTime: string | null
    endTime: string | null
    breakMins: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShiftCountAggregateOutputType = {
    id: number
    name: number
    code: number
    startTime: number
    endTime: number
    breakMins: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShiftAvgAggregateInputType = {
    breakMins?: true
  }

  export type ShiftSumAggregateInputType = {
    breakMins?: true
  }

  export type ShiftMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    startTime?: true
    endTime?: true
    breakMins?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShiftMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    startTime?: true
    endTime?: true
    breakMins?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShiftCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    startTime?: true
    endTime?: true
    breakMins?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ShiftAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shift to aggregate.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shifts
    **/
    _count?: true | ShiftCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShiftAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShiftSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShiftMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShiftMaxAggregateInputType
  }

  export type GetShiftAggregateType<T extends ShiftAggregateArgs> = {
        [P in keyof T & keyof AggregateShift]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShift[P]>
      : GetScalarType<T[P], AggregateShift[P]>
  }




  export type ShiftGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftWhereInput
    orderBy?: ShiftOrderByWithAggregationInput | ShiftOrderByWithAggregationInput[]
    by: ShiftScalarFieldEnum[] | ShiftScalarFieldEnum
    having?: ShiftScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShiftCountAggregateInputType | true
    _avg?: ShiftAvgAggregateInputType
    _sum?: ShiftSumAggregateInputType
    _min?: ShiftMinAggregateInputType
    _max?: ShiftMaxAggregateInputType
  }

  export type ShiftGroupByOutputType = {
    id: string
    name: string
    code: string
    startTime: string
    endTime: string
    breakMins: number
    status: string
    createdAt: Date
    updatedAt: Date
    _count: ShiftCountAggregateOutputType | null
    _avg: ShiftAvgAggregateOutputType | null
    _sum: ShiftSumAggregateOutputType | null
    _min: ShiftMinAggregateOutputType | null
    _max: ShiftMaxAggregateOutputType | null
  }

  type GetShiftGroupByPayload<T extends ShiftGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShiftGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShiftGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShiftGroupByOutputType[P]>
            : GetScalarType<T[P], ShiftGroupByOutputType[P]>
        }
      >
    >


  export type ShiftSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    startTime?: boolean
    endTime?: boolean
    breakMins?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignments?: boolean | Shift$assignmentsArgs<ExtArgs>
    _count?: boolean | ShiftCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shift"]>

  export type ShiftSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    startTime?: boolean
    endTime?: boolean
    breakMins?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shift"]>

  export type ShiftSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    startTime?: boolean
    endTime?: boolean
    breakMins?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShiftInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignments?: boolean | Shift$assignmentsArgs<ExtArgs>
    _count?: boolean | ShiftCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShiftIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ShiftPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shift"
    objects: {
      assignments: Prisma.$ShiftAssignmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      startTime: string
      endTime: string
      breakMins: number
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["shift"]>
    composites: {}
  }

  type ShiftGetPayload<S extends boolean | null | undefined | ShiftDefaultArgs> = $Result.GetResult<Prisma.$ShiftPayload, S>

  type ShiftCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ShiftFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ShiftCountAggregateInputType | true
    }

  export interface ShiftDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shift'], meta: { name: 'Shift' } }
    /**
     * Find zero or one Shift that matches the filter.
     * @param {ShiftFindUniqueArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShiftFindUniqueArgs>(args: SelectSubset<T, ShiftFindUniqueArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Shift that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ShiftFindUniqueOrThrowArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShiftFindUniqueOrThrowArgs>(args: SelectSubset<T, ShiftFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Shift that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftFindFirstArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShiftFindFirstArgs>(args?: SelectSubset<T, ShiftFindFirstArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Shift that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftFindFirstOrThrowArgs} args - Arguments to find a Shift
     * @example
     * // Get one Shift
     * const shift = await prisma.shift.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShiftFindFirstOrThrowArgs>(args?: SelectSubset<T, ShiftFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Shifts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shifts
     * const shifts = await prisma.shift.findMany()
     * 
     * // Get first 10 Shifts
     * const shifts = await prisma.shift.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shiftWithIdOnly = await prisma.shift.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShiftFindManyArgs>(args?: SelectSubset<T, ShiftFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Shift.
     * @param {ShiftCreateArgs} args - Arguments to create a Shift.
     * @example
     * // Create one Shift
     * const Shift = await prisma.shift.create({
     *   data: {
     *     // ... data to create a Shift
     *   }
     * })
     * 
     */
    create<T extends ShiftCreateArgs>(args: SelectSubset<T, ShiftCreateArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Shifts.
     * @param {ShiftCreateManyArgs} args - Arguments to create many Shifts.
     * @example
     * // Create many Shifts
     * const shift = await prisma.shift.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShiftCreateManyArgs>(args?: SelectSubset<T, ShiftCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shifts and returns the data saved in the database.
     * @param {ShiftCreateManyAndReturnArgs} args - Arguments to create many Shifts.
     * @example
     * // Create many Shifts
     * const shift = await prisma.shift.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shifts and only return the `id`
     * const shiftWithIdOnly = await prisma.shift.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShiftCreateManyAndReturnArgs>(args?: SelectSubset<T, ShiftCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Shift.
     * @param {ShiftDeleteArgs} args - Arguments to delete one Shift.
     * @example
     * // Delete one Shift
     * const Shift = await prisma.shift.delete({
     *   where: {
     *     // ... filter to delete one Shift
     *   }
     * })
     * 
     */
    delete<T extends ShiftDeleteArgs>(args: SelectSubset<T, ShiftDeleteArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Shift.
     * @param {ShiftUpdateArgs} args - Arguments to update one Shift.
     * @example
     * // Update one Shift
     * const shift = await prisma.shift.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShiftUpdateArgs>(args: SelectSubset<T, ShiftUpdateArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Shifts.
     * @param {ShiftDeleteManyArgs} args - Arguments to filter Shifts to delete.
     * @example
     * // Delete a few Shifts
     * const { count } = await prisma.shift.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShiftDeleteManyArgs>(args?: SelectSubset<T, ShiftDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shifts
     * const shift = await prisma.shift.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShiftUpdateManyArgs>(args: SelectSubset<T, ShiftUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Shift.
     * @param {ShiftUpsertArgs} args - Arguments to update or create a Shift.
     * @example
     * // Update or create a Shift
     * const shift = await prisma.shift.upsert({
     *   create: {
     *     // ... data to create a Shift
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shift we want to update
     *   }
     * })
     */
    upsert<T extends ShiftUpsertArgs>(args: SelectSubset<T, ShiftUpsertArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Shifts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftCountArgs} args - Arguments to filter Shifts to count.
     * @example
     * // Count the number of Shifts
     * const count = await prisma.shift.count({
     *   where: {
     *     // ... the filter for the Shifts we want to count
     *   }
     * })
    **/
    count<T extends ShiftCountArgs>(
      args?: Subset<T, ShiftCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShiftCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShiftAggregateArgs>(args: Subset<T, ShiftAggregateArgs>): Prisma.PrismaPromise<GetShiftAggregateType<T>>

    /**
     * Group by Shift.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShiftGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShiftGroupByArgs['orderBy'] }
        : { orderBy?: ShiftGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShiftGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShiftGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shift model
   */
  readonly fields: ShiftFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shift.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShiftClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignments<T extends Shift$assignmentsArgs<ExtArgs> = {}>(args?: Subset<T, Shift$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shift model
   */ 
  interface ShiftFieldRefs {
    readonly id: FieldRef<"Shift", 'String'>
    readonly name: FieldRef<"Shift", 'String'>
    readonly code: FieldRef<"Shift", 'String'>
    readonly startTime: FieldRef<"Shift", 'String'>
    readonly endTime: FieldRef<"Shift", 'String'>
    readonly breakMins: FieldRef<"Shift", 'Int'>
    readonly status: FieldRef<"Shift", 'String'>
    readonly createdAt: FieldRef<"Shift", 'DateTime'>
    readonly updatedAt: FieldRef<"Shift", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Shift findUnique
   */
  export type ShiftFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift findUniqueOrThrow
   */
  export type ShiftFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift findFirst
   */
  export type ShiftFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shifts.
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shifts.
     */
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Shift findFirstOrThrow
   */
  export type ShiftFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shift to fetch.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shifts.
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shifts.
     */
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Shift findMany
   */
  export type ShiftFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter, which Shifts to fetch.
     */
    where?: ShiftWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shifts to fetch.
     */
    orderBy?: ShiftOrderByWithRelationInput | ShiftOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shifts.
     */
    cursor?: ShiftWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shifts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shifts.
     */
    skip?: number
    distinct?: ShiftScalarFieldEnum | ShiftScalarFieldEnum[]
  }

  /**
   * Shift create
   */
  export type ShiftCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * The data needed to create a Shift.
     */
    data: XOR<ShiftCreateInput, ShiftUncheckedCreateInput>
  }

  /**
   * Shift createMany
   */
  export type ShiftCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shifts.
     */
    data: ShiftCreateManyInput | ShiftCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shift createManyAndReturn
   */
  export type ShiftCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Shifts.
     */
    data: ShiftCreateManyInput | ShiftCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shift update
   */
  export type ShiftUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * The data needed to update a Shift.
     */
    data: XOR<ShiftUpdateInput, ShiftUncheckedUpdateInput>
    /**
     * Choose, which Shift to update.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift updateMany
   */
  export type ShiftUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shifts.
     */
    data: XOR<ShiftUpdateManyMutationInput, ShiftUncheckedUpdateManyInput>
    /**
     * Filter which Shifts to update
     */
    where?: ShiftWhereInput
  }

  /**
   * Shift upsert
   */
  export type ShiftUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * The filter to search for the Shift to update in case it exists.
     */
    where: ShiftWhereUniqueInput
    /**
     * In case the Shift found by the `where` argument doesn't exist, create a new Shift with this data.
     */
    create: XOR<ShiftCreateInput, ShiftUncheckedCreateInput>
    /**
     * In case the Shift was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShiftUpdateInput, ShiftUncheckedUpdateInput>
  }

  /**
   * Shift delete
   */
  export type ShiftDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
    /**
     * Filter which Shift to delete.
     */
    where: ShiftWhereUniqueInput
  }

  /**
   * Shift deleteMany
   */
  export type ShiftDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shifts to delete
     */
    where?: ShiftWhereInput
  }

  /**
   * Shift.assignments
   */
  export type Shift$assignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    where?: ShiftAssignmentWhereInput
    orderBy?: ShiftAssignmentOrderByWithRelationInput | ShiftAssignmentOrderByWithRelationInput[]
    cursor?: ShiftAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShiftAssignmentScalarFieldEnum | ShiftAssignmentScalarFieldEnum[]
  }

  /**
   * Shift without action
   */
  export type ShiftDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shift
     */
    select?: ShiftSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftInclude<ExtArgs> | null
  }


  /**
   * Model ShiftAssignment
   */

  export type AggregateShiftAssignment = {
    _count: ShiftAssignmentCountAggregateOutputType | null
    _min: ShiftAssignmentMinAggregateOutputType | null
    _max: ShiftAssignmentMaxAggregateOutputType | null
  }

  export type ShiftAssignmentMinAggregateOutputType = {
    id: string | null
    employeeId: string | null
    shiftId: string | null
    date: Date | null
    createdAt: Date | null
  }

  export type ShiftAssignmentMaxAggregateOutputType = {
    id: string | null
    employeeId: string | null
    shiftId: string | null
    date: Date | null
    createdAt: Date | null
  }

  export type ShiftAssignmentCountAggregateOutputType = {
    id: number
    employeeId: number
    shiftId: number
    date: number
    createdAt: number
    _all: number
  }


  export type ShiftAssignmentMinAggregateInputType = {
    id?: true
    employeeId?: true
    shiftId?: true
    date?: true
    createdAt?: true
  }

  export type ShiftAssignmentMaxAggregateInputType = {
    id?: true
    employeeId?: true
    shiftId?: true
    date?: true
    createdAt?: true
  }

  export type ShiftAssignmentCountAggregateInputType = {
    id?: true
    employeeId?: true
    shiftId?: true
    date?: true
    createdAt?: true
    _all?: true
  }

  export type ShiftAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShiftAssignment to aggregate.
     */
    where?: ShiftAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShiftAssignments to fetch.
     */
    orderBy?: ShiftAssignmentOrderByWithRelationInput | ShiftAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShiftAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShiftAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShiftAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShiftAssignments
    **/
    _count?: true | ShiftAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShiftAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShiftAssignmentMaxAggregateInputType
  }

  export type GetShiftAssignmentAggregateType<T extends ShiftAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateShiftAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShiftAssignment[P]>
      : GetScalarType<T[P], AggregateShiftAssignment[P]>
  }




  export type ShiftAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShiftAssignmentWhereInput
    orderBy?: ShiftAssignmentOrderByWithAggregationInput | ShiftAssignmentOrderByWithAggregationInput[]
    by: ShiftAssignmentScalarFieldEnum[] | ShiftAssignmentScalarFieldEnum
    having?: ShiftAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShiftAssignmentCountAggregateInputType | true
    _min?: ShiftAssignmentMinAggregateInputType
    _max?: ShiftAssignmentMaxAggregateInputType
  }

  export type ShiftAssignmentGroupByOutputType = {
    id: string
    employeeId: string
    shiftId: string
    date: Date
    createdAt: Date
    _count: ShiftAssignmentCountAggregateOutputType | null
    _min: ShiftAssignmentMinAggregateOutputType | null
    _max: ShiftAssignmentMaxAggregateOutputType | null
  }

  type GetShiftAssignmentGroupByPayload<T extends ShiftAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShiftAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShiftAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShiftAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], ShiftAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type ShiftAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    shiftId?: boolean
    date?: boolean
    createdAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shiftAssignment"]>

  export type ShiftAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    shiftId?: boolean
    date?: boolean
    createdAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shiftAssignment"]>

  export type ShiftAssignmentSelectScalar = {
    id?: boolean
    employeeId?: boolean
    shiftId?: boolean
    date?: boolean
    createdAt?: boolean
  }

  export type ShiftAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }
  export type ShiftAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    shift?: boolean | ShiftDefaultArgs<ExtArgs>
  }

  export type $ShiftAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShiftAssignment"
    objects: {
      employee: Prisma.$EmployeePayload<ExtArgs>
      shift: Prisma.$ShiftPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeId: string
      shiftId: string
      date: Date
      createdAt: Date
    }, ExtArgs["result"]["shiftAssignment"]>
    composites: {}
  }

  type ShiftAssignmentGetPayload<S extends boolean | null | undefined | ShiftAssignmentDefaultArgs> = $Result.GetResult<Prisma.$ShiftAssignmentPayload, S>

  type ShiftAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ShiftAssignmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ShiftAssignmentCountAggregateInputType | true
    }

  export interface ShiftAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShiftAssignment'], meta: { name: 'ShiftAssignment' } }
    /**
     * Find zero or one ShiftAssignment that matches the filter.
     * @param {ShiftAssignmentFindUniqueArgs} args - Arguments to find a ShiftAssignment
     * @example
     * // Get one ShiftAssignment
     * const shiftAssignment = await prisma.shiftAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShiftAssignmentFindUniqueArgs>(args: SelectSubset<T, ShiftAssignmentFindUniqueArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ShiftAssignment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ShiftAssignmentFindUniqueOrThrowArgs} args - Arguments to find a ShiftAssignment
     * @example
     * // Get one ShiftAssignment
     * const shiftAssignment = await prisma.shiftAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShiftAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ShiftAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ShiftAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentFindFirstArgs} args - Arguments to find a ShiftAssignment
     * @example
     * // Get one ShiftAssignment
     * const shiftAssignment = await prisma.shiftAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShiftAssignmentFindFirstArgs>(args?: SelectSubset<T, ShiftAssignmentFindFirstArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ShiftAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentFindFirstOrThrowArgs} args - Arguments to find a ShiftAssignment
     * @example
     * // Get one ShiftAssignment
     * const shiftAssignment = await prisma.shiftAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShiftAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ShiftAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ShiftAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShiftAssignments
     * const shiftAssignments = await prisma.shiftAssignment.findMany()
     * 
     * // Get first 10 ShiftAssignments
     * const shiftAssignments = await prisma.shiftAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shiftAssignmentWithIdOnly = await prisma.shiftAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShiftAssignmentFindManyArgs>(args?: SelectSubset<T, ShiftAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ShiftAssignment.
     * @param {ShiftAssignmentCreateArgs} args - Arguments to create a ShiftAssignment.
     * @example
     * // Create one ShiftAssignment
     * const ShiftAssignment = await prisma.shiftAssignment.create({
     *   data: {
     *     // ... data to create a ShiftAssignment
     *   }
     * })
     * 
     */
    create<T extends ShiftAssignmentCreateArgs>(args: SelectSubset<T, ShiftAssignmentCreateArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ShiftAssignments.
     * @param {ShiftAssignmentCreateManyArgs} args - Arguments to create many ShiftAssignments.
     * @example
     * // Create many ShiftAssignments
     * const shiftAssignment = await prisma.shiftAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShiftAssignmentCreateManyArgs>(args?: SelectSubset<T, ShiftAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShiftAssignments and returns the data saved in the database.
     * @param {ShiftAssignmentCreateManyAndReturnArgs} args - Arguments to create many ShiftAssignments.
     * @example
     * // Create many ShiftAssignments
     * const shiftAssignment = await prisma.shiftAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShiftAssignments and only return the `id`
     * const shiftAssignmentWithIdOnly = await prisma.shiftAssignment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShiftAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ShiftAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ShiftAssignment.
     * @param {ShiftAssignmentDeleteArgs} args - Arguments to delete one ShiftAssignment.
     * @example
     * // Delete one ShiftAssignment
     * const ShiftAssignment = await prisma.shiftAssignment.delete({
     *   where: {
     *     // ... filter to delete one ShiftAssignment
     *   }
     * })
     * 
     */
    delete<T extends ShiftAssignmentDeleteArgs>(args: SelectSubset<T, ShiftAssignmentDeleteArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ShiftAssignment.
     * @param {ShiftAssignmentUpdateArgs} args - Arguments to update one ShiftAssignment.
     * @example
     * // Update one ShiftAssignment
     * const shiftAssignment = await prisma.shiftAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShiftAssignmentUpdateArgs>(args: SelectSubset<T, ShiftAssignmentUpdateArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ShiftAssignments.
     * @param {ShiftAssignmentDeleteManyArgs} args - Arguments to filter ShiftAssignments to delete.
     * @example
     * // Delete a few ShiftAssignments
     * const { count } = await prisma.shiftAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShiftAssignmentDeleteManyArgs>(args?: SelectSubset<T, ShiftAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShiftAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShiftAssignments
     * const shiftAssignment = await prisma.shiftAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShiftAssignmentUpdateManyArgs>(args: SelectSubset<T, ShiftAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ShiftAssignment.
     * @param {ShiftAssignmentUpsertArgs} args - Arguments to update or create a ShiftAssignment.
     * @example
     * // Update or create a ShiftAssignment
     * const shiftAssignment = await prisma.shiftAssignment.upsert({
     *   create: {
     *     // ... data to create a ShiftAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShiftAssignment we want to update
     *   }
     * })
     */
    upsert<T extends ShiftAssignmentUpsertArgs>(args: SelectSubset<T, ShiftAssignmentUpsertArgs<ExtArgs>>): Prisma__ShiftAssignmentClient<$Result.GetResult<Prisma.$ShiftAssignmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ShiftAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentCountArgs} args - Arguments to filter ShiftAssignments to count.
     * @example
     * // Count the number of ShiftAssignments
     * const count = await prisma.shiftAssignment.count({
     *   where: {
     *     // ... the filter for the ShiftAssignments we want to count
     *   }
     * })
    **/
    count<T extends ShiftAssignmentCountArgs>(
      args?: Subset<T, ShiftAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShiftAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShiftAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShiftAssignmentAggregateArgs>(args: Subset<T, ShiftAssignmentAggregateArgs>): Prisma.PrismaPromise<GetShiftAssignmentAggregateType<T>>

    /**
     * Group by ShiftAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShiftAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShiftAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShiftAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: ShiftAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShiftAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShiftAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShiftAssignment model
   */
  readonly fields: ShiftAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShiftAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShiftAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    shift<T extends ShiftDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShiftDefaultArgs<ExtArgs>>): Prisma__ShiftClient<$Result.GetResult<Prisma.$ShiftPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShiftAssignment model
   */ 
  interface ShiftAssignmentFieldRefs {
    readonly id: FieldRef<"ShiftAssignment", 'String'>
    readonly employeeId: FieldRef<"ShiftAssignment", 'String'>
    readonly shiftId: FieldRef<"ShiftAssignment", 'String'>
    readonly date: FieldRef<"ShiftAssignment", 'DateTime'>
    readonly createdAt: FieldRef<"ShiftAssignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShiftAssignment findUnique
   */
  export type ShiftAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ShiftAssignment to fetch.
     */
    where: ShiftAssignmentWhereUniqueInput
  }

  /**
   * ShiftAssignment findUniqueOrThrow
   */
  export type ShiftAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ShiftAssignment to fetch.
     */
    where: ShiftAssignmentWhereUniqueInput
  }

  /**
   * ShiftAssignment findFirst
   */
  export type ShiftAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ShiftAssignment to fetch.
     */
    where?: ShiftAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShiftAssignments to fetch.
     */
    orderBy?: ShiftAssignmentOrderByWithRelationInput | ShiftAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShiftAssignments.
     */
    cursor?: ShiftAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShiftAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShiftAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShiftAssignments.
     */
    distinct?: ShiftAssignmentScalarFieldEnum | ShiftAssignmentScalarFieldEnum[]
  }

  /**
   * ShiftAssignment findFirstOrThrow
   */
  export type ShiftAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ShiftAssignment to fetch.
     */
    where?: ShiftAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShiftAssignments to fetch.
     */
    orderBy?: ShiftAssignmentOrderByWithRelationInput | ShiftAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShiftAssignments.
     */
    cursor?: ShiftAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShiftAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShiftAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShiftAssignments.
     */
    distinct?: ShiftAssignmentScalarFieldEnum | ShiftAssignmentScalarFieldEnum[]
  }

  /**
   * ShiftAssignment findMany
   */
  export type ShiftAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which ShiftAssignments to fetch.
     */
    where?: ShiftAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShiftAssignments to fetch.
     */
    orderBy?: ShiftAssignmentOrderByWithRelationInput | ShiftAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShiftAssignments.
     */
    cursor?: ShiftAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShiftAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShiftAssignments.
     */
    skip?: number
    distinct?: ShiftAssignmentScalarFieldEnum | ShiftAssignmentScalarFieldEnum[]
  }

  /**
   * ShiftAssignment create
   */
  export type ShiftAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a ShiftAssignment.
     */
    data: XOR<ShiftAssignmentCreateInput, ShiftAssignmentUncheckedCreateInput>
  }

  /**
   * ShiftAssignment createMany
   */
  export type ShiftAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShiftAssignments.
     */
    data: ShiftAssignmentCreateManyInput | ShiftAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShiftAssignment createManyAndReturn
   */
  export type ShiftAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ShiftAssignments.
     */
    data: ShiftAssignmentCreateManyInput | ShiftAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShiftAssignment update
   */
  export type ShiftAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a ShiftAssignment.
     */
    data: XOR<ShiftAssignmentUpdateInput, ShiftAssignmentUncheckedUpdateInput>
    /**
     * Choose, which ShiftAssignment to update.
     */
    where: ShiftAssignmentWhereUniqueInput
  }

  /**
   * ShiftAssignment updateMany
   */
  export type ShiftAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShiftAssignments.
     */
    data: XOR<ShiftAssignmentUpdateManyMutationInput, ShiftAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which ShiftAssignments to update
     */
    where?: ShiftAssignmentWhereInput
  }

  /**
   * ShiftAssignment upsert
   */
  export type ShiftAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the ShiftAssignment to update in case it exists.
     */
    where: ShiftAssignmentWhereUniqueInput
    /**
     * In case the ShiftAssignment found by the `where` argument doesn't exist, create a new ShiftAssignment with this data.
     */
    create: XOR<ShiftAssignmentCreateInput, ShiftAssignmentUncheckedCreateInput>
    /**
     * In case the ShiftAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShiftAssignmentUpdateInput, ShiftAssignmentUncheckedUpdateInput>
  }

  /**
   * ShiftAssignment delete
   */
  export type ShiftAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
    /**
     * Filter which ShiftAssignment to delete.
     */
    where: ShiftAssignmentWhereUniqueInput
  }

  /**
   * ShiftAssignment deleteMany
   */
  export type ShiftAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShiftAssignments to delete
     */
    where?: ShiftAssignmentWhereInput
  }

  /**
   * ShiftAssignment without action
   */
  export type ShiftAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShiftAssignment
     */
    select?: ShiftAssignmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShiftAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model LeaveRequest
   */

  export type AggregateLeaveRequest = {
    _count: LeaveRequestCountAggregateOutputType | null
    _avg: LeaveRequestAvgAggregateOutputType | null
    _sum: LeaveRequestSumAggregateOutputType | null
    _min: LeaveRequestMinAggregateOutputType | null
    _max: LeaveRequestMaxAggregateOutputType | null
  }

  export type LeaveRequestAvgAggregateOutputType = {
    days: number | null
  }

  export type LeaveRequestSumAggregateOutputType = {
    days: number | null
  }

  export type LeaveRequestMinAggregateOutputType = {
    id: string | null
    employeeId: string | null
    leaveType: $Enums.LeaveType | null
    startDate: Date | null
    endDate: Date | null
    days: number | null
    reason: string | null
    status: $Enums.LeaveStatus | null
    approvedBy: string | null
    approvedAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeaveRequestMaxAggregateOutputType = {
    id: string | null
    employeeId: string | null
    leaveType: $Enums.LeaveType | null
    startDate: Date | null
    endDate: Date | null
    days: number | null
    reason: string | null
    status: $Enums.LeaveStatus | null
    approvedBy: string | null
    approvedAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeaveRequestCountAggregateOutputType = {
    id: number
    employeeId: number
    leaveType: number
    startDate: number
    endDate: number
    days: number
    reason: number
    status: number
    approvedBy: number
    approvedAt: number
    rejectionReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeaveRequestAvgAggregateInputType = {
    days?: true
  }

  export type LeaveRequestSumAggregateInputType = {
    days?: true
  }

  export type LeaveRequestMinAggregateInputType = {
    id?: true
    employeeId?: true
    leaveType?: true
    startDate?: true
    endDate?: true
    days?: true
    reason?: true
    status?: true
    approvedBy?: true
    approvedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeaveRequestMaxAggregateInputType = {
    id?: true
    employeeId?: true
    leaveType?: true
    startDate?: true
    endDate?: true
    days?: true
    reason?: true
    status?: true
    approvedBy?: true
    approvedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeaveRequestCountAggregateInputType = {
    id?: true
    employeeId?: true
    leaveType?: true
    startDate?: true
    endDate?: true
    days?: true
    reason?: true
    status?: true
    approvedBy?: true
    approvedAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeaveRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeaveRequest to aggregate.
     */
    where?: LeaveRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaveRequests to fetch.
     */
    orderBy?: LeaveRequestOrderByWithRelationInput | LeaveRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeaveRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaveRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaveRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LeaveRequests
    **/
    _count?: true | LeaveRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeaveRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeaveRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeaveRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeaveRequestMaxAggregateInputType
  }

  export type GetLeaveRequestAggregateType<T extends LeaveRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateLeaveRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeaveRequest[P]>
      : GetScalarType<T[P], AggregateLeaveRequest[P]>
  }




  export type LeaveRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaveRequestWhereInput
    orderBy?: LeaveRequestOrderByWithAggregationInput | LeaveRequestOrderByWithAggregationInput[]
    by: LeaveRequestScalarFieldEnum[] | LeaveRequestScalarFieldEnum
    having?: LeaveRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeaveRequestCountAggregateInputType | true
    _avg?: LeaveRequestAvgAggregateInputType
    _sum?: LeaveRequestSumAggregateInputType
    _min?: LeaveRequestMinAggregateInputType
    _max?: LeaveRequestMaxAggregateInputType
  }

  export type LeaveRequestGroupByOutputType = {
    id: string
    employeeId: string
    leaveType: $Enums.LeaveType
    startDate: Date
    endDate: Date
    days: number
    reason: string | null
    status: $Enums.LeaveStatus
    approvedBy: string | null
    approvedAt: Date | null
    rejectionReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: LeaveRequestCountAggregateOutputType | null
    _avg: LeaveRequestAvgAggregateOutputType | null
    _sum: LeaveRequestSumAggregateOutputType | null
    _min: LeaveRequestMinAggregateOutputType | null
    _max: LeaveRequestMaxAggregateOutputType | null
  }

  type GetLeaveRequestGroupByPayload<T extends LeaveRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeaveRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeaveRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeaveRequestGroupByOutputType[P]>
            : GetScalarType<T[P], LeaveRequestGroupByOutputType[P]>
        }
      >
    >


  export type LeaveRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    leaveType?: boolean
    startDate?: boolean
    endDate?: boolean
    days?: boolean
    reason?: boolean
    status?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaveRequest"]>

  export type LeaveRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    leaveType?: boolean
    startDate?: boolean
    endDate?: boolean
    days?: boolean
    reason?: boolean
    status?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaveRequest"]>

  export type LeaveRequestSelectScalar = {
    id?: boolean
    employeeId?: boolean
    leaveType?: boolean
    startDate?: boolean
    endDate?: boolean
    days?: boolean
    reason?: boolean
    status?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeaveRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type LeaveRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }

  export type $LeaveRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LeaveRequest"
    objects: {
      employee: Prisma.$EmployeePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeId: string
      leaveType: $Enums.LeaveType
      startDate: Date
      endDate: Date
      days: number
      reason: string | null
      status: $Enums.LeaveStatus
      approvedBy: string | null
      approvedAt: Date | null
      rejectionReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["leaveRequest"]>
    composites: {}
  }

  type LeaveRequestGetPayload<S extends boolean | null | undefined | LeaveRequestDefaultArgs> = $Result.GetResult<Prisma.$LeaveRequestPayload, S>

  type LeaveRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LeaveRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LeaveRequestCountAggregateInputType | true
    }

  export interface LeaveRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LeaveRequest'], meta: { name: 'LeaveRequest' } }
    /**
     * Find zero or one LeaveRequest that matches the filter.
     * @param {LeaveRequestFindUniqueArgs} args - Arguments to find a LeaveRequest
     * @example
     * // Get one LeaveRequest
     * const leaveRequest = await prisma.leaveRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeaveRequestFindUniqueArgs>(args: SelectSubset<T, LeaveRequestFindUniqueArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LeaveRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LeaveRequestFindUniqueOrThrowArgs} args - Arguments to find a LeaveRequest
     * @example
     * // Get one LeaveRequest
     * const leaveRequest = await prisma.leaveRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeaveRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, LeaveRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LeaveRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestFindFirstArgs} args - Arguments to find a LeaveRequest
     * @example
     * // Get one LeaveRequest
     * const leaveRequest = await prisma.leaveRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeaveRequestFindFirstArgs>(args?: SelectSubset<T, LeaveRequestFindFirstArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LeaveRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestFindFirstOrThrowArgs} args - Arguments to find a LeaveRequest
     * @example
     * // Get one LeaveRequest
     * const leaveRequest = await prisma.leaveRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeaveRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, LeaveRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LeaveRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LeaveRequests
     * const leaveRequests = await prisma.leaveRequest.findMany()
     * 
     * // Get first 10 LeaveRequests
     * const leaveRequests = await prisma.leaveRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leaveRequestWithIdOnly = await prisma.leaveRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeaveRequestFindManyArgs>(args?: SelectSubset<T, LeaveRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LeaveRequest.
     * @param {LeaveRequestCreateArgs} args - Arguments to create a LeaveRequest.
     * @example
     * // Create one LeaveRequest
     * const LeaveRequest = await prisma.leaveRequest.create({
     *   data: {
     *     // ... data to create a LeaveRequest
     *   }
     * })
     * 
     */
    create<T extends LeaveRequestCreateArgs>(args: SelectSubset<T, LeaveRequestCreateArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LeaveRequests.
     * @param {LeaveRequestCreateManyArgs} args - Arguments to create many LeaveRequests.
     * @example
     * // Create many LeaveRequests
     * const leaveRequest = await prisma.leaveRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeaveRequestCreateManyArgs>(args?: SelectSubset<T, LeaveRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LeaveRequests and returns the data saved in the database.
     * @param {LeaveRequestCreateManyAndReturnArgs} args - Arguments to create many LeaveRequests.
     * @example
     * // Create many LeaveRequests
     * const leaveRequest = await prisma.leaveRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LeaveRequests and only return the `id`
     * const leaveRequestWithIdOnly = await prisma.leaveRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeaveRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, LeaveRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a LeaveRequest.
     * @param {LeaveRequestDeleteArgs} args - Arguments to delete one LeaveRequest.
     * @example
     * // Delete one LeaveRequest
     * const LeaveRequest = await prisma.leaveRequest.delete({
     *   where: {
     *     // ... filter to delete one LeaveRequest
     *   }
     * })
     * 
     */
    delete<T extends LeaveRequestDeleteArgs>(args: SelectSubset<T, LeaveRequestDeleteArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LeaveRequest.
     * @param {LeaveRequestUpdateArgs} args - Arguments to update one LeaveRequest.
     * @example
     * // Update one LeaveRequest
     * const leaveRequest = await prisma.leaveRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeaveRequestUpdateArgs>(args: SelectSubset<T, LeaveRequestUpdateArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LeaveRequests.
     * @param {LeaveRequestDeleteManyArgs} args - Arguments to filter LeaveRequests to delete.
     * @example
     * // Delete a few LeaveRequests
     * const { count } = await prisma.leaveRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeaveRequestDeleteManyArgs>(args?: SelectSubset<T, LeaveRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeaveRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LeaveRequests
     * const leaveRequest = await prisma.leaveRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeaveRequestUpdateManyArgs>(args: SelectSubset<T, LeaveRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LeaveRequest.
     * @param {LeaveRequestUpsertArgs} args - Arguments to update or create a LeaveRequest.
     * @example
     * // Update or create a LeaveRequest
     * const leaveRequest = await prisma.leaveRequest.upsert({
     *   create: {
     *     // ... data to create a LeaveRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LeaveRequest we want to update
     *   }
     * })
     */
    upsert<T extends LeaveRequestUpsertArgs>(args: SelectSubset<T, LeaveRequestUpsertArgs<ExtArgs>>): Prisma__LeaveRequestClient<$Result.GetResult<Prisma.$LeaveRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of LeaveRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestCountArgs} args - Arguments to filter LeaveRequests to count.
     * @example
     * // Count the number of LeaveRequests
     * const count = await prisma.leaveRequest.count({
     *   where: {
     *     // ... the filter for the LeaveRequests we want to count
     *   }
     * })
    **/
    count<T extends LeaveRequestCountArgs>(
      args?: Subset<T, LeaveRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeaveRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LeaveRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeaveRequestAggregateArgs>(args: Subset<T, LeaveRequestAggregateArgs>): Prisma.PrismaPromise<GetLeaveRequestAggregateType<T>>

    /**
     * Group by LeaveRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaveRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeaveRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeaveRequestGroupByArgs['orderBy'] }
        : { orderBy?: LeaveRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeaveRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeaveRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LeaveRequest model
   */
  readonly fields: LeaveRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LeaveRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeaveRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LeaveRequest model
   */ 
  interface LeaveRequestFieldRefs {
    readonly id: FieldRef<"LeaveRequest", 'String'>
    readonly employeeId: FieldRef<"LeaveRequest", 'String'>
    readonly leaveType: FieldRef<"LeaveRequest", 'LeaveType'>
    readonly startDate: FieldRef<"LeaveRequest", 'DateTime'>
    readonly endDate: FieldRef<"LeaveRequest", 'DateTime'>
    readonly days: FieldRef<"LeaveRequest", 'Int'>
    readonly reason: FieldRef<"LeaveRequest", 'String'>
    readonly status: FieldRef<"LeaveRequest", 'LeaveStatus'>
    readonly approvedBy: FieldRef<"LeaveRequest", 'String'>
    readonly approvedAt: FieldRef<"LeaveRequest", 'DateTime'>
    readonly rejectionReason: FieldRef<"LeaveRequest", 'String'>
    readonly createdAt: FieldRef<"LeaveRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"LeaveRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LeaveRequest findUnique
   */
  export type LeaveRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * Filter, which LeaveRequest to fetch.
     */
    where: LeaveRequestWhereUniqueInput
  }

  /**
   * LeaveRequest findUniqueOrThrow
   */
  export type LeaveRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * Filter, which LeaveRequest to fetch.
     */
    where: LeaveRequestWhereUniqueInput
  }

  /**
   * LeaveRequest findFirst
   */
  export type LeaveRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * Filter, which LeaveRequest to fetch.
     */
    where?: LeaveRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaveRequests to fetch.
     */
    orderBy?: LeaveRequestOrderByWithRelationInput | LeaveRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeaveRequests.
     */
    cursor?: LeaveRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaveRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaveRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaveRequests.
     */
    distinct?: LeaveRequestScalarFieldEnum | LeaveRequestScalarFieldEnum[]
  }

  /**
   * LeaveRequest findFirstOrThrow
   */
  export type LeaveRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * Filter, which LeaveRequest to fetch.
     */
    where?: LeaveRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaveRequests to fetch.
     */
    orderBy?: LeaveRequestOrderByWithRelationInput | LeaveRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeaveRequests.
     */
    cursor?: LeaveRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaveRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaveRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaveRequests.
     */
    distinct?: LeaveRequestScalarFieldEnum | LeaveRequestScalarFieldEnum[]
  }

  /**
   * LeaveRequest findMany
   */
  export type LeaveRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * Filter, which LeaveRequests to fetch.
     */
    where?: LeaveRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaveRequests to fetch.
     */
    orderBy?: LeaveRequestOrderByWithRelationInput | LeaveRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LeaveRequests.
     */
    cursor?: LeaveRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaveRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaveRequests.
     */
    skip?: number
    distinct?: LeaveRequestScalarFieldEnum | LeaveRequestScalarFieldEnum[]
  }

  /**
   * LeaveRequest create
   */
  export type LeaveRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a LeaveRequest.
     */
    data: XOR<LeaveRequestCreateInput, LeaveRequestUncheckedCreateInput>
  }

  /**
   * LeaveRequest createMany
   */
  export type LeaveRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LeaveRequests.
     */
    data: LeaveRequestCreateManyInput | LeaveRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeaveRequest createManyAndReturn
   */
  export type LeaveRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many LeaveRequests.
     */
    data: LeaveRequestCreateManyInput | LeaveRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeaveRequest update
   */
  export type LeaveRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a LeaveRequest.
     */
    data: XOR<LeaveRequestUpdateInput, LeaveRequestUncheckedUpdateInput>
    /**
     * Choose, which LeaveRequest to update.
     */
    where: LeaveRequestWhereUniqueInput
  }

  /**
   * LeaveRequest updateMany
   */
  export type LeaveRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LeaveRequests.
     */
    data: XOR<LeaveRequestUpdateManyMutationInput, LeaveRequestUncheckedUpdateManyInput>
    /**
     * Filter which LeaveRequests to update
     */
    where?: LeaveRequestWhereInput
  }

  /**
   * LeaveRequest upsert
   */
  export type LeaveRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the LeaveRequest to update in case it exists.
     */
    where: LeaveRequestWhereUniqueInput
    /**
     * In case the LeaveRequest found by the `where` argument doesn't exist, create a new LeaveRequest with this data.
     */
    create: XOR<LeaveRequestCreateInput, LeaveRequestUncheckedCreateInput>
    /**
     * In case the LeaveRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeaveRequestUpdateInput, LeaveRequestUncheckedUpdateInput>
  }

  /**
   * LeaveRequest delete
   */
  export type LeaveRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
    /**
     * Filter which LeaveRequest to delete.
     */
    where: LeaveRequestWhereUniqueInput
  }

  /**
   * LeaveRequest deleteMany
   */
  export type LeaveRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeaveRequests to delete
     */
    where?: LeaveRequestWhereInput
  }

  /**
   * LeaveRequest without action
   */
  export type LeaveRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaveRequest
     */
    select?: LeaveRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaveRequestInclude<ExtArgs> | null
  }


  /**
   * Model Payroll
   */

  export type AggregatePayroll = {
    _count: PayrollCountAggregateOutputType | null
    _avg: PayrollAvgAggregateOutputType | null
    _sum: PayrollSumAggregateOutputType | null
    _min: PayrollMinAggregateOutputType | null
    _max: PayrollMaxAggregateOutputType | null
  }

  export type PayrollAvgAggregateOutputType = {
    baseSalary: Decimal | null
    allowances: Decimal | null
    deductions: Decimal | null
    overtimePay: Decimal | null
    bonus: Decimal | null
    tax: Decimal | null
    netPay: Decimal | null
  }

  export type PayrollSumAggregateOutputType = {
    baseSalary: Decimal | null
    allowances: Decimal | null
    deductions: Decimal | null
    overtimePay: Decimal | null
    bonus: Decimal | null
    tax: Decimal | null
    netPay: Decimal | null
  }

  export type PayrollMinAggregateOutputType = {
    id: string | null
    employeeId: string | null
    payPeriod: string | null
    baseSalary: Decimal | null
    allowances: Decimal | null
    deductions: Decimal | null
    overtimePay: Decimal | null
    bonus: Decimal | null
    tax: Decimal | null
    netPay: Decimal | null
    status: $Enums.PayrollStatus | null
    paidAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayrollMaxAggregateOutputType = {
    id: string | null
    employeeId: string | null
    payPeriod: string | null
    baseSalary: Decimal | null
    allowances: Decimal | null
    deductions: Decimal | null
    overtimePay: Decimal | null
    bonus: Decimal | null
    tax: Decimal | null
    netPay: Decimal | null
    status: $Enums.PayrollStatus | null
    paidAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayrollCountAggregateOutputType = {
    id: number
    employeeId: number
    payPeriod: number
    baseSalary: number
    allowances: number
    deductions: number
    overtimePay: number
    bonus: number
    tax: number
    netPay: number
    status: number
    paidAt: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayrollAvgAggregateInputType = {
    baseSalary?: true
    allowances?: true
    deductions?: true
    overtimePay?: true
    bonus?: true
    tax?: true
    netPay?: true
  }

  export type PayrollSumAggregateInputType = {
    baseSalary?: true
    allowances?: true
    deductions?: true
    overtimePay?: true
    bonus?: true
    tax?: true
    netPay?: true
  }

  export type PayrollMinAggregateInputType = {
    id?: true
    employeeId?: true
    payPeriod?: true
    baseSalary?: true
    allowances?: true
    deductions?: true
    overtimePay?: true
    bonus?: true
    tax?: true
    netPay?: true
    status?: true
    paidAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayrollMaxAggregateInputType = {
    id?: true
    employeeId?: true
    payPeriod?: true
    baseSalary?: true
    allowances?: true
    deductions?: true
    overtimePay?: true
    bonus?: true
    tax?: true
    netPay?: true
    status?: true
    paidAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayrollCountAggregateInputType = {
    id?: true
    employeeId?: true
    payPeriod?: true
    baseSalary?: true
    allowances?: true
    deductions?: true
    overtimePay?: true
    bonus?: true
    tax?: true
    netPay?: true
    status?: true
    paidAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayrollAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payroll to aggregate.
     */
    where?: PayrollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payrolls to fetch.
     */
    orderBy?: PayrollOrderByWithRelationInput | PayrollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayrollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payrolls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payrolls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payrolls
    **/
    _count?: true | PayrollCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayrollAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayrollSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayrollMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayrollMaxAggregateInputType
  }

  export type GetPayrollAggregateType<T extends PayrollAggregateArgs> = {
        [P in keyof T & keyof AggregatePayroll]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayroll[P]>
      : GetScalarType<T[P], AggregatePayroll[P]>
  }




  export type PayrollGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayrollWhereInput
    orderBy?: PayrollOrderByWithAggregationInput | PayrollOrderByWithAggregationInput[]
    by: PayrollScalarFieldEnum[] | PayrollScalarFieldEnum
    having?: PayrollScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayrollCountAggregateInputType | true
    _avg?: PayrollAvgAggregateInputType
    _sum?: PayrollSumAggregateInputType
    _min?: PayrollMinAggregateInputType
    _max?: PayrollMaxAggregateInputType
  }

  export type PayrollGroupByOutputType = {
    id: string
    employeeId: string
    payPeriod: string
    baseSalary: Decimal
    allowances: Decimal
    deductions: Decimal
    overtimePay: Decimal
    bonus: Decimal
    tax: Decimal
    netPay: Decimal
    status: $Enums.PayrollStatus
    paidAt: Date | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: PayrollCountAggregateOutputType | null
    _avg: PayrollAvgAggregateOutputType | null
    _sum: PayrollSumAggregateOutputType | null
    _min: PayrollMinAggregateOutputType | null
    _max: PayrollMaxAggregateOutputType | null
  }

  type GetPayrollGroupByPayload<T extends PayrollGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayrollGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayrollGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayrollGroupByOutputType[P]>
            : GetScalarType<T[P], PayrollGroupByOutputType[P]>
        }
      >
    >


  export type PayrollSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    payPeriod?: boolean
    baseSalary?: boolean
    allowances?: boolean
    deductions?: boolean
    overtimePay?: boolean
    bonus?: boolean
    tax?: boolean
    netPay?: boolean
    status?: boolean
    paidAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payroll"]>

  export type PayrollSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    payPeriod?: boolean
    baseSalary?: boolean
    allowances?: boolean
    deductions?: boolean
    overtimePay?: boolean
    bonus?: boolean
    tax?: boolean
    netPay?: boolean
    status?: boolean
    paidAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payroll"]>

  export type PayrollSelectScalar = {
    id?: boolean
    employeeId?: boolean
    payPeriod?: boolean
    baseSalary?: boolean
    allowances?: boolean
    deductions?: boolean
    overtimePay?: boolean
    bonus?: boolean
    tax?: boolean
    netPay?: boolean
    status?: boolean
    paidAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayrollInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type PayrollIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }

  export type $PayrollPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payroll"
    objects: {
      employee: Prisma.$EmployeePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeId: string
      payPeriod: string
      baseSalary: Prisma.Decimal
      allowances: Prisma.Decimal
      deductions: Prisma.Decimal
      overtimePay: Prisma.Decimal
      bonus: Prisma.Decimal
      tax: Prisma.Decimal
      netPay: Prisma.Decimal
      status: $Enums.PayrollStatus
      paidAt: Date | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payroll"]>
    composites: {}
  }

  type PayrollGetPayload<S extends boolean | null | undefined | PayrollDefaultArgs> = $Result.GetResult<Prisma.$PayrollPayload, S>

  type PayrollCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PayrollFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PayrollCountAggregateInputType | true
    }

  export interface PayrollDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payroll'], meta: { name: 'Payroll' } }
    /**
     * Find zero or one Payroll that matches the filter.
     * @param {PayrollFindUniqueArgs} args - Arguments to find a Payroll
     * @example
     * // Get one Payroll
     * const payroll = await prisma.payroll.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayrollFindUniqueArgs>(args: SelectSubset<T, PayrollFindUniqueArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payroll that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PayrollFindUniqueOrThrowArgs} args - Arguments to find a Payroll
     * @example
     * // Get one Payroll
     * const payroll = await prisma.payroll.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayrollFindUniqueOrThrowArgs>(args: SelectSubset<T, PayrollFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payroll that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollFindFirstArgs} args - Arguments to find a Payroll
     * @example
     * // Get one Payroll
     * const payroll = await prisma.payroll.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayrollFindFirstArgs>(args?: SelectSubset<T, PayrollFindFirstArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payroll that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollFindFirstOrThrowArgs} args - Arguments to find a Payroll
     * @example
     * // Get one Payroll
     * const payroll = await prisma.payroll.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayrollFindFirstOrThrowArgs>(args?: SelectSubset<T, PayrollFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payrolls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payrolls
     * const payrolls = await prisma.payroll.findMany()
     * 
     * // Get first 10 Payrolls
     * const payrolls = await prisma.payroll.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payrollWithIdOnly = await prisma.payroll.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayrollFindManyArgs>(args?: SelectSubset<T, PayrollFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payroll.
     * @param {PayrollCreateArgs} args - Arguments to create a Payroll.
     * @example
     * // Create one Payroll
     * const Payroll = await prisma.payroll.create({
     *   data: {
     *     // ... data to create a Payroll
     *   }
     * })
     * 
     */
    create<T extends PayrollCreateArgs>(args: SelectSubset<T, PayrollCreateArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payrolls.
     * @param {PayrollCreateManyArgs} args - Arguments to create many Payrolls.
     * @example
     * // Create many Payrolls
     * const payroll = await prisma.payroll.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayrollCreateManyArgs>(args?: SelectSubset<T, PayrollCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payrolls and returns the data saved in the database.
     * @param {PayrollCreateManyAndReturnArgs} args - Arguments to create many Payrolls.
     * @example
     * // Create many Payrolls
     * const payroll = await prisma.payroll.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payrolls and only return the `id`
     * const payrollWithIdOnly = await prisma.payroll.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PayrollCreateManyAndReturnArgs>(args?: SelectSubset<T, PayrollCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payroll.
     * @param {PayrollDeleteArgs} args - Arguments to delete one Payroll.
     * @example
     * // Delete one Payroll
     * const Payroll = await prisma.payroll.delete({
     *   where: {
     *     // ... filter to delete one Payroll
     *   }
     * })
     * 
     */
    delete<T extends PayrollDeleteArgs>(args: SelectSubset<T, PayrollDeleteArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payroll.
     * @param {PayrollUpdateArgs} args - Arguments to update one Payroll.
     * @example
     * // Update one Payroll
     * const payroll = await prisma.payroll.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayrollUpdateArgs>(args: SelectSubset<T, PayrollUpdateArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payrolls.
     * @param {PayrollDeleteManyArgs} args - Arguments to filter Payrolls to delete.
     * @example
     * // Delete a few Payrolls
     * const { count } = await prisma.payroll.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayrollDeleteManyArgs>(args?: SelectSubset<T, PayrollDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payrolls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payrolls
     * const payroll = await prisma.payroll.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayrollUpdateManyArgs>(args: SelectSubset<T, PayrollUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payroll.
     * @param {PayrollUpsertArgs} args - Arguments to update or create a Payroll.
     * @example
     * // Update or create a Payroll
     * const payroll = await prisma.payroll.upsert({
     *   create: {
     *     // ... data to create a Payroll
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payroll we want to update
     *   }
     * })
     */
    upsert<T extends PayrollUpsertArgs>(args: SelectSubset<T, PayrollUpsertArgs<ExtArgs>>): Prisma__PayrollClient<$Result.GetResult<Prisma.$PayrollPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payrolls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollCountArgs} args - Arguments to filter Payrolls to count.
     * @example
     * // Count the number of Payrolls
     * const count = await prisma.payroll.count({
     *   where: {
     *     // ... the filter for the Payrolls we want to count
     *   }
     * })
    **/
    count<T extends PayrollCountArgs>(
      args?: Subset<T, PayrollCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayrollCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payroll.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayrollAggregateArgs>(args: Subset<T, PayrollAggregateArgs>): Prisma.PrismaPromise<GetPayrollAggregateType<T>>

    /**
     * Group by Payroll.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayrollGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayrollGroupByArgs['orderBy'] }
        : { orderBy?: PayrollGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayrollGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayrollGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payroll model
   */
  readonly fields: PayrollFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payroll.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayrollClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payroll model
   */ 
  interface PayrollFieldRefs {
    readonly id: FieldRef<"Payroll", 'String'>
    readonly employeeId: FieldRef<"Payroll", 'String'>
    readonly payPeriod: FieldRef<"Payroll", 'String'>
    readonly baseSalary: FieldRef<"Payroll", 'Decimal'>
    readonly allowances: FieldRef<"Payroll", 'Decimal'>
    readonly deductions: FieldRef<"Payroll", 'Decimal'>
    readonly overtimePay: FieldRef<"Payroll", 'Decimal'>
    readonly bonus: FieldRef<"Payroll", 'Decimal'>
    readonly tax: FieldRef<"Payroll", 'Decimal'>
    readonly netPay: FieldRef<"Payroll", 'Decimal'>
    readonly status: FieldRef<"Payroll", 'PayrollStatus'>
    readonly paidAt: FieldRef<"Payroll", 'DateTime'>
    readonly notes: FieldRef<"Payroll", 'String'>
    readonly createdAt: FieldRef<"Payroll", 'DateTime'>
    readonly updatedAt: FieldRef<"Payroll", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payroll findUnique
   */
  export type PayrollFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * Filter, which Payroll to fetch.
     */
    where: PayrollWhereUniqueInput
  }

  /**
   * Payroll findUniqueOrThrow
   */
  export type PayrollFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * Filter, which Payroll to fetch.
     */
    where: PayrollWhereUniqueInput
  }

  /**
   * Payroll findFirst
   */
  export type PayrollFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * Filter, which Payroll to fetch.
     */
    where?: PayrollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payrolls to fetch.
     */
    orderBy?: PayrollOrderByWithRelationInput | PayrollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payrolls.
     */
    cursor?: PayrollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payrolls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payrolls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payrolls.
     */
    distinct?: PayrollScalarFieldEnum | PayrollScalarFieldEnum[]
  }

  /**
   * Payroll findFirstOrThrow
   */
  export type PayrollFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * Filter, which Payroll to fetch.
     */
    where?: PayrollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payrolls to fetch.
     */
    orderBy?: PayrollOrderByWithRelationInput | PayrollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payrolls.
     */
    cursor?: PayrollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payrolls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payrolls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payrolls.
     */
    distinct?: PayrollScalarFieldEnum | PayrollScalarFieldEnum[]
  }

  /**
   * Payroll findMany
   */
  export type PayrollFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * Filter, which Payrolls to fetch.
     */
    where?: PayrollWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payrolls to fetch.
     */
    orderBy?: PayrollOrderByWithRelationInput | PayrollOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payrolls.
     */
    cursor?: PayrollWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payrolls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payrolls.
     */
    skip?: number
    distinct?: PayrollScalarFieldEnum | PayrollScalarFieldEnum[]
  }

  /**
   * Payroll create
   */
  export type PayrollCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * The data needed to create a Payroll.
     */
    data: XOR<PayrollCreateInput, PayrollUncheckedCreateInput>
  }

  /**
   * Payroll createMany
   */
  export type PayrollCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payrolls.
     */
    data: PayrollCreateManyInput | PayrollCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payroll createManyAndReturn
   */
  export type PayrollCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payrolls.
     */
    data: PayrollCreateManyInput | PayrollCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payroll update
   */
  export type PayrollUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * The data needed to update a Payroll.
     */
    data: XOR<PayrollUpdateInput, PayrollUncheckedUpdateInput>
    /**
     * Choose, which Payroll to update.
     */
    where: PayrollWhereUniqueInput
  }

  /**
   * Payroll updateMany
   */
  export type PayrollUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payrolls.
     */
    data: XOR<PayrollUpdateManyMutationInput, PayrollUncheckedUpdateManyInput>
    /**
     * Filter which Payrolls to update
     */
    where?: PayrollWhereInput
  }

  /**
   * Payroll upsert
   */
  export type PayrollUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * The filter to search for the Payroll to update in case it exists.
     */
    where: PayrollWhereUniqueInput
    /**
     * In case the Payroll found by the `where` argument doesn't exist, create a new Payroll with this data.
     */
    create: XOR<PayrollCreateInput, PayrollUncheckedCreateInput>
    /**
     * In case the Payroll was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayrollUpdateInput, PayrollUncheckedUpdateInput>
  }

  /**
   * Payroll delete
   */
  export type PayrollDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
    /**
     * Filter which Payroll to delete.
     */
    where: PayrollWhereUniqueInput
  }

  /**
   * Payroll deleteMany
   */
  export type PayrollDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payrolls to delete
     */
    where?: PayrollWhereInput
  }

  /**
   * Payroll without action
   */
  export type PayrollDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payroll
     */
    select?: PayrollSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayrollInclude<ExtArgs> | null
  }


  /**
   * Model PerformanceReview
   */

  export type AggregatePerformanceReview = {
    _count: PerformanceReviewCountAggregateOutputType | null
    _min: PerformanceReviewMinAggregateOutputType | null
    _max: PerformanceReviewMaxAggregateOutputType | null
  }

  export type PerformanceReviewMinAggregateOutputType = {
    id: string | null
    employeeId: string | null
    reviewerId: string | null
    period: string | null
    rating: $Enums.PerformanceRating | null
    strengths: string | null
    improvements: string | null
    comments: string | null
    nextReview: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PerformanceReviewMaxAggregateOutputType = {
    id: string | null
    employeeId: string | null
    reviewerId: string | null
    period: string | null
    rating: $Enums.PerformanceRating | null
    strengths: string | null
    improvements: string | null
    comments: string | null
    nextReview: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PerformanceReviewCountAggregateOutputType = {
    id: number
    employeeId: number
    reviewerId: number
    period: number
    rating: number
    goals: number
    strengths: number
    improvements: number
    comments: number
    nextReview: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PerformanceReviewMinAggregateInputType = {
    id?: true
    employeeId?: true
    reviewerId?: true
    period?: true
    rating?: true
    strengths?: true
    improvements?: true
    comments?: true
    nextReview?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PerformanceReviewMaxAggregateInputType = {
    id?: true
    employeeId?: true
    reviewerId?: true
    period?: true
    rating?: true
    strengths?: true
    improvements?: true
    comments?: true
    nextReview?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PerformanceReviewCountAggregateInputType = {
    id?: true
    employeeId?: true
    reviewerId?: true
    period?: true
    rating?: true
    goals?: true
    strengths?: true
    improvements?: true
    comments?: true
    nextReview?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PerformanceReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PerformanceReview to aggregate.
     */
    where?: PerformanceReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceReviews to fetch.
     */
    orderBy?: PerformanceReviewOrderByWithRelationInput | PerformanceReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PerformanceReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PerformanceReviews
    **/
    _count?: true | PerformanceReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PerformanceReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PerformanceReviewMaxAggregateInputType
  }

  export type GetPerformanceReviewAggregateType<T extends PerformanceReviewAggregateArgs> = {
        [P in keyof T & keyof AggregatePerformanceReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePerformanceReview[P]>
      : GetScalarType<T[P], AggregatePerformanceReview[P]>
  }




  export type PerformanceReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerformanceReviewWhereInput
    orderBy?: PerformanceReviewOrderByWithAggregationInput | PerformanceReviewOrderByWithAggregationInput[]
    by: PerformanceReviewScalarFieldEnum[] | PerformanceReviewScalarFieldEnum
    having?: PerformanceReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PerformanceReviewCountAggregateInputType | true
    _min?: PerformanceReviewMinAggregateInputType
    _max?: PerformanceReviewMaxAggregateInputType
  }

  export type PerformanceReviewGroupByOutputType = {
    id: string
    employeeId: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals: JsonValue | null
    strengths: string | null
    improvements: string | null
    comments: string | null
    nextReview: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PerformanceReviewCountAggregateOutputType | null
    _min: PerformanceReviewMinAggregateOutputType | null
    _max: PerformanceReviewMaxAggregateOutputType | null
  }

  type GetPerformanceReviewGroupByPayload<T extends PerformanceReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PerformanceReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PerformanceReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PerformanceReviewGroupByOutputType[P]>
            : GetScalarType<T[P], PerformanceReviewGroupByOutputType[P]>
        }
      >
    >


  export type PerformanceReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    reviewerId?: boolean
    period?: boolean
    rating?: boolean
    goals?: boolean
    strengths?: boolean
    improvements?: boolean
    comments?: boolean
    nextReview?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["performanceReview"]>

  export type PerformanceReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    reviewerId?: boolean
    period?: boolean
    rating?: boolean
    goals?: boolean
    strengths?: boolean
    improvements?: boolean
    comments?: boolean
    nextReview?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["performanceReview"]>

  export type PerformanceReviewSelectScalar = {
    id?: boolean
    employeeId?: boolean
    reviewerId?: boolean
    period?: boolean
    rating?: boolean
    goals?: boolean
    strengths?: boolean
    improvements?: boolean
    comments?: boolean
    nextReview?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PerformanceReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }
  export type PerformanceReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
  }

  export type $PerformanceReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PerformanceReview"
    objects: {
      employee: Prisma.$EmployeePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeId: string
      reviewerId: string
      period: string
      rating: $Enums.PerformanceRating
      goals: Prisma.JsonValue | null
      strengths: string | null
      improvements: string | null
      comments: string | null
      nextReview: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["performanceReview"]>
    composites: {}
  }

  type PerformanceReviewGetPayload<S extends boolean | null | undefined | PerformanceReviewDefaultArgs> = $Result.GetResult<Prisma.$PerformanceReviewPayload, S>

  type PerformanceReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PerformanceReviewFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PerformanceReviewCountAggregateInputType | true
    }

  export interface PerformanceReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PerformanceReview'], meta: { name: 'PerformanceReview' } }
    /**
     * Find zero or one PerformanceReview that matches the filter.
     * @param {PerformanceReviewFindUniqueArgs} args - Arguments to find a PerformanceReview
     * @example
     * // Get one PerformanceReview
     * const performanceReview = await prisma.performanceReview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PerformanceReviewFindUniqueArgs>(args: SelectSubset<T, PerformanceReviewFindUniqueArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PerformanceReview that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PerformanceReviewFindUniqueOrThrowArgs} args - Arguments to find a PerformanceReview
     * @example
     * // Get one PerformanceReview
     * const performanceReview = await prisma.performanceReview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PerformanceReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, PerformanceReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PerformanceReview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewFindFirstArgs} args - Arguments to find a PerformanceReview
     * @example
     * // Get one PerformanceReview
     * const performanceReview = await prisma.performanceReview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PerformanceReviewFindFirstArgs>(args?: SelectSubset<T, PerformanceReviewFindFirstArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PerformanceReview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewFindFirstOrThrowArgs} args - Arguments to find a PerformanceReview
     * @example
     * // Get one PerformanceReview
     * const performanceReview = await prisma.performanceReview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PerformanceReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, PerformanceReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PerformanceReviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PerformanceReviews
     * const performanceReviews = await prisma.performanceReview.findMany()
     * 
     * // Get first 10 PerformanceReviews
     * const performanceReviews = await prisma.performanceReview.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const performanceReviewWithIdOnly = await prisma.performanceReview.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PerformanceReviewFindManyArgs>(args?: SelectSubset<T, PerformanceReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PerformanceReview.
     * @param {PerformanceReviewCreateArgs} args - Arguments to create a PerformanceReview.
     * @example
     * // Create one PerformanceReview
     * const PerformanceReview = await prisma.performanceReview.create({
     *   data: {
     *     // ... data to create a PerformanceReview
     *   }
     * })
     * 
     */
    create<T extends PerformanceReviewCreateArgs>(args: SelectSubset<T, PerformanceReviewCreateArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PerformanceReviews.
     * @param {PerformanceReviewCreateManyArgs} args - Arguments to create many PerformanceReviews.
     * @example
     * // Create many PerformanceReviews
     * const performanceReview = await prisma.performanceReview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PerformanceReviewCreateManyArgs>(args?: SelectSubset<T, PerformanceReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PerformanceReviews and returns the data saved in the database.
     * @param {PerformanceReviewCreateManyAndReturnArgs} args - Arguments to create many PerformanceReviews.
     * @example
     * // Create many PerformanceReviews
     * const performanceReview = await prisma.performanceReview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PerformanceReviews and only return the `id`
     * const performanceReviewWithIdOnly = await prisma.performanceReview.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PerformanceReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, PerformanceReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PerformanceReview.
     * @param {PerformanceReviewDeleteArgs} args - Arguments to delete one PerformanceReview.
     * @example
     * // Delete one PerformanceReview
     * const PerformanceReview = await prisma.performanceReview.delete({
     *   where: {
     *     // ... filter to delete one PerformanceReview
     *   }
     * })
     * 
     */
    delete<T extends PerformanceReviewDeleteArgs>(args: SelectSubset<T, PerformanceReviewDeleteArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PerformanceReview.
     * @param {PerformanceReviewUpdateArgs} args - Arguments to update one PerformanceReview.
     * @example
     * // Update one PerformanceReview
     * const performanceReview = await prisma.performanceReview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PerformanceReviewUpdateArgs>(args: SelectSubset<T, PerformanceReviewUpdateArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PerformanceReviews.
     * @param {PerformanceReviewDeleteManyArgs} args - Arguments to filter PerformanceReviews to delete.
     * @example
     * // Delete a few PerformanceReviews
     * const { count } = await prisma.performanceReview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PerformanceReviewDeleteManyArgs>(args?: SelectSubset<T, PerformanceReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PerformanceReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PerformanceReviews
     * const performanceReview = await prisma.performanceReview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PerformanceReviewUpdateManyArgs>(args: SelectSubset<T, PerformanceReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PerformanceReview.
     * @param {PerformanceReviewUpsertArgs} args - Arguments to update or create a PerformanceReview.
     * @example
     * // Update or create a PerformanceReview
     * const performanceReview = await prisma.performanceReview.upsert({
     *   create: {
     *     // ... data to create a PerformanceReview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PerformanceReview we want to update
     *   }
     * })
     */
    upsert<T extends PerformanceReviewUpsertArgs>(args: SelectSubset<T, PerformanceReviewUpsertArgs<ExtArgs>>): Prisma__PerformanceReviewClient<$Result.GetResult<Prisma.$PerformanceReviewPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PerformanceReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewCountArgs} args - Arguments to filter PerformanceReviews to count.
     * @example
     * // Count the number of PerformanceReviews
     * const count = await prisma.performanceReview.count({
     *   where: {
     *     // ... the filter for the PerformanceReviews we want to count
     *   }
     * })
    **/
    count<T extends PerformanceReviewCountArgs>(
      args?: Subset<T, PerformanceReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PerformanceReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PerformanceReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PerformanceReviewAggregateArgs>(args: Subset<T, PerformanceReviewAggregateArgs>): Prisma.PrismaPromise<GetPerformanceReviewAggregateType<T>>

    /**
     * Group by PerformanceReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerformanceReviewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PerformanceReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PerformanceReviewGroupByArgs['orderBy'] }
        : { orderBy?: PerformanceReviewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PerformanceReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPerformanceReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PerformanceReview model
   */
  readonly fields: PerformanceReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PerformanceReview.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PerformanceReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PerformanceReview model
   */ 
  interface PerformanceReviewFieldRefs {
    readonly id: FieldRef<"PerformanceReview", 'String'>
    readonly employeeId: FieldRef<"PerformanceReview", 'String'>
    readonly reviewerId: FieldRef<"PerformanceReview", 'String'>
    readonly period: FieldRef<"PerformanceReview", 'String'>
    readonly rating: FieldRef<"PerformanceReview", 'PerformanceRating'>
    readonly goals: FieldRef<"PerformanceReview", 'Json'>
    readonly strengths: FieldRef<"PerformanceReview", 'String'>
    readonly improvements: FieldRef<"PerformanceReview", 'String'>
    readonly comments: FieldRef<"PerformanceReview", 'String'>
    readonly nextReview: FieldRef<"PerformanceReview", 'DateTime'>
    readonly createdAt: FieldRef<"PerformanceReview", 'DateTime'>
    readonly updatedAt: FieldRef<"PerformanceReview", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PerformanceReview findUnique
   */
  export type PerformanceReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * Filter, which PerformanceReview to fetch.
     */
    where: PerformanceReviewWhereUniqueInput
  }

  /**
   * PerformanceReview findUniqueOrThrow
   */
  export type PerformanceReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * Filter, which PerformanceReview to fetch.
     */
    where: PerformanceReviewWhereUniqueInput
  }

  /**
   * PerformanceReview findFirst
   */
  export type PerformanceReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * Filter, which PerformanceReview to fetch.
     */
    where?: PerformanceReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceReviews to fetch.
     */
    orderBy?: PerformanceReviewOrderByWithRelationInput | PerformanceReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PerformanceReviews.
     */
    cursor?: PerformanceReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PerformanceReviews.
     */
    distinct?: PerformanceReviewScalarFieldEnum | PerformanceReviewScalarFieldEnum[]
  }

  /**
   * PerformanceReview findFirstOrThrow
   */
  export type PerformanceReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * Filter, which PerformanceReview to fetch.
     */
    where?: PerformanceReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceReviews to fetch.
     */
    orderBy?: PerformanceReviewOrderByWithRelationInput | PerformanceReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PerformanceReviews.
     */
    cursor?: PerformanceReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PerformanceReviews.
     */
    distinct?: PerformanceReviewScalarFieldEnum | PerformanceReviewScalarFieldEnum[]
  }

  /**
   * PerformanceReview findMany
   */
  export type PerformanceReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * Filter, which PerformanceReviews to fetch.
     */
    where?: PerformanceReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PerformanceReviews to fetch.
     */
    orderBy?: PerformanceReviewOrderByWithRelationInput | PerformanceReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PerformanceReviews.
     */
    cursor?: PerformanceReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PerformanceReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PerformanceReviews.
     */
    skip?: number
    distinct?: PerformanceReviewScalarFieldEnum | PerformanceReviewScalarFieldEnum[]
  }

  /**
   * PerformanceReview create
   */
  export type PerformanceReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a PerformanceReview.
     */
    data: XOR<PerformanceReviewCreateInput, PerformanceReviewUncheckedCreateInput>
  }

  /**
   * PerformanceReview createMany
   */
  export type PerformanceReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PerformanceReviews.
     */
    data: PerformanceReviewCreateManyInput | PerformanceReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PerformanceReview createManyAndReturn
   */
  export type PerformanceReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PerformanceReviews.
     */
    data: PerformanceReviewCreateManyInput | PerformanceReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PerformanceReview update
   */
  export type PerformanceReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a PerformanceReview.
     */
    data: XOR<PerformanceReviewUpdateInput, PerformanceReviewUncheckedUpdateInput>
    /**
     * Choose, which PerformanceReview to update.
     */
    where: PerformanceReviewWhereUniqueInput
  }

  /**
   * PerformanceReview updateMany
   */
  export type PerformanceReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PerformanceReviews.
     */
    data: XOR<PerformanceReviewUpdateManyMutationInput, PerformanceReviewUncheckedUpdateManyInput>
    /**
     * Filter which PerformanceReviews to update
     */
    where?: PerformanceReviewWhereInput
  }

  /**
   * PerformanceReview upsert
   */
  export type PerformanceReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the PerformanceReview to update in case it exists.
     */
    where: PerformanceReviewWhereUniqueInput
    /**
     * In case the PerformanceReview found by the `where` argument doesn't exist, create a new PerformanceReview with this data.
     */
    create: XOR<PerformanceReviewCreateInput, PerformanceReviewUncheckedCreateInput>
    /**
     * In case the PerformanceReview was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PerformanceReviewUpdateInput, PerformanceReviewUncheckedUpdateInput>
  }

  /**
   * PerformanceReview delete
   */
  export type PerformanceReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
    /**
     * Filter which PerformanceReview to delete.
     */
    where: PerformanceReviewWhereUniqueInput
  }

  /**
   * PerformanceReview deleteMany
   */
  export type PerformanceReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PerformanceReviews to delete
     */
    where?: PerformanceReviewWhereInput
  }

  /**
   * PerformanceReview without action
   */
  export type PerformanceReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerformanceReview
     */
    select?: PerformanceReviewSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerformanceReviewInclude<ExtArgs> | null
  }


  /**
   * Model Training
   */

  export type AggregateTraining = {
    _count: TrainingCountAggregateOutputType | null
    _avg: TrainingAvgAggregateOutputType | null
    _sum: TrainingSumAggregateOutputType | null
    _min: TrainingMinAggregateOutputType | null
    _max: TrainingMaxAggregateOutputType | null
  }

  export type TrainingAvgAggregateOutputType = {
    duration: number | null
    cost: Decimal | null
    maxEnroll: number | null
  }

  export type TrainingSumAggregateOutputType = {
    duration: number | null
    cost: Decimal | null
    maxEnroll: number | null
  }

  export type TrainingMinAggregateOutputType = {
    id: string | null
    title: string | null
    code: string | null
    description: string | null
    duration: number | null
    provider: string | null
    cost: Decimal | null
    maxEnroll: number | null
    startDate: Date | null
    endDate: Date | null
    status: $Enums.TrainingStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrainingMaxAggregateOutputType = {
    id: string | null
    title: string | null
    code: string | null
    description: string | null
    duration: number | null
    provider: string | null
    cost: Decimal | null
    maxEnroll: number | null
    startDate: Date | null
    endDate: Date | null
    status: $Enums.TrainingStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrainingCountAggregateOutputType = {
    id: number
    title: number
    code: number
    description: number
    duration: number
    provider: number
    cost: number
    maxEnroll: number
    startDate: number
    endDate: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrainingAvgAggregateInputType = {
    duration?: true
    cost?: true
    maxEnroll?: true
  }

  export type TrainingSumAggregateInputType = {
    duration?: true
    cost?: true
    maxEnroll?: true
  }

  export type TrainingMinAggregateInputType = {
    id?: true
    title?: true
    code?: true
    description?: true
    duration?: true
    provider?: true
    cost?: true
    maxEnroll?: true
    startDate?: true
    endDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrainingMaxAggregateInputType = {
    id?: true
    title?: true
    code?: true
    description?: true
    duration?: true
    provider?: true
    cost?: true
    maxEnroll?: true
    startDate?: true
    endDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrainingCountAggregateInputType = {
    id?: true
    title?: true
    code?: true
    description?: true
    duration?: true
    provider?: true
    cost?: true
    maxEnroll?: true
    startDate?: true
    endDate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrainingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Training to aggregate.
     */
    where?: TrainingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trainings to fetch.
     */
    orderBy?: TrainingOrderByWithRelationInput | TrainingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrainingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trainings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trainings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trainings
    **/
    _count?: true | TrainingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrainingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrainingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrainingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrainingMaxAggregateInputType
  }

  export type GetTrainingAggregateType<T extends TrainingAggregateArgs> = {
        [P in keyof T & keyof AggregateTraining]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTraining[P]>
      : GetScalarType<T[P], AggregateTraining[P]>
  }




  export type TrainingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrainingWhereInput
    orderBy?: TrainingOrderByWithAggregationInput | TrainingOrderByWithAggregationInput[]
    by: TrainingScalarFieldEnum[] | TrainingScalarFieldEnum
    having?: TrainingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrainingCountAggregateInputType | true
    _avg?: TrainingAvgAggregateInputType
    _sum?: TrainingSumAggregateInputType
    _min?: TrainingMinAggregateInputType
    _max?: TrainingMaxAggregateInputType
  }

  export type TrainingGroupByOutputType = {
    id: string
    title: string
    code: string
    description: string | null
    duration: number | null
    provider: string | null
    cost: Decimal | null
    maxEnroll: number | null
    startDate: Date | null
    endDate: Date | null
    status: $Enums.TrainingStatus
    createdAt: Date
    updatedAt: Date
    _count: TrainingCountAggregateOutputType | null
    _avg: TrainingAvgAggregateOutputType | null
    _sum: TrainingSumAggregateOutputType | null
    _min: TrainingMinAggregateOutputType | null
    _max: TrainingMaxAggregateOutputType | null
  }

  type GetTrainingGroupByPayload<T extends TrainingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrainingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrainingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrainingGroupByOutputType[P]>
            : GetScalarType<T[P], TrainingGroupByOutputType[P]>
        }
      >
    >


  export type TrainingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    code?: boolean
    description?: boolean
    duration?: boolean
    provider?: boolean
    cost?: boolean
    maxEnroll?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enrollments?: boolean | Training$enrollmentsArgs<ExtArgs>
    _count?: boolean | TrainingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["training"]>

  export type TrainingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    code?: boolean
    description?: boolean
    duration?: boolean
    provider?: boolean
    cost?: boolean
    maxEnroll?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["training"]>

  export type TrainingSelectScalar = {
    id?: boolean
    title?: boolean
    code?: boolean
    description?: boolean
    duration?: boolean
    provider?: boolean
    cost?: boolean
    maxEnroll?: boolean
    startDate?: boolean
    endDate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrainingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | Training$enrollmentsArgs<ExtArgs>
    _count?: boolean | TrainingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TrainingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TrainingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Training"
    objects: {
      enrollments: Prisma.$TrainingEnrollmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      code: string
      description: string | null
      duration: number | null
      provider: string | null
      cost: Prisma.Decimal | null
      maxEnroll: number | null
      startDate: Date | null
      endDate: Date | null
      status: $Enums.TrainingStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["training"]>
    composites: {}
  }

  type TrainingGetPayload<S extends boolean | null | undefined | TrainingDefaultArgs> = $Result.GetResult<Prisma.$TrainingPayload, S>

  type TrainingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrainingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrainingCountAggregateInputType | true
    }

  export interface TrainingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Training'], meta: { name: 'Training' } }
    /**
     * Find zero or one Training that matches the filter.
     * @param {TrainingFindUniqueArgs} args - Arguments to find a Training
     * @example
     * // Get one Training
     * const training = await prisma.training.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrainingFindUniqueArgs>(args: SelectSubset<T, TrainingFindUniqueArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Training that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrainingFindUniqueOrThrowArgs} args - Arguments to find a Training
     * @example
     * // Get one Training
     * const training = await prisma.training.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrainingFindUniqueOrThrowArgs>(args: SelectSubset<T, TrainingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Training that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingFindFirstArgs} args - Arguments to find a Training
     * @example
     * // Get one Training
     * const training = await prisma.training.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrainingFindFirstArgs>(args?: SelectSubset<T, TrainingFindFirstArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Training that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingFindFirstOrThrowArgs} args - Arguments to find a Training
     * @example
     * // Get one Training
     * const training = await prisma.training.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrainingFindFirstOrThrowArgs>(args?: SelectSubset<T, TrainingFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Trainings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trainings
     * const trainings = await prisma.training.findMany()
     * 
     * // Get first 10 Trainings
     * const trainings = await prisma.training.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trainingWithIdOnly = await prisma.training.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrainingFindManyArgs>(args?: SelectSubset<T, TrainingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Training.
     * @param {TrainingCreateArgs} args - Arguments to create a Training.
     * @example
     * // Create one Training
     * const Training = await prisma.training.create({
     *   data: {
     *     // ... data to create a Training
     *   }
     * })
     * 
     */
    create<T extends TrainingCreateArgs>(args: SelectSubset<T, TrainingCreateArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Trainings.
     * @param {TrainingCreateManyArgs} args - Arguments to create many Trainings.
     * @example
     * // Create many Trainings
     * const training = await prisma.training.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrainingCreateManyArgs>(args?: SelectSubset<T, TrainingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trainings and returns the data saved in the database.
     * @param {TrainingCreateManyAndReturnArgs} args - Arguments to create many Trainings.
     * @example
     * // Create many Trainings
     * const training = await prisma.training.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trainings and only return the `id`
     * const trainingWithIdOnly = await prisma.training.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrainingCreateManyAndReturnArgs>(args?: SelectSubset<T, TrainingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Training.
     * @param {TrainingDeleteArgs} args - Arguments to delete one Training.
     * @example
     * // Delete one Training
     * const Training = await prisma.training.delete({
     *   where: {
     *     // ... filter to delete one Training
     *   }
     * })
     * 
     */
    delete<T extends TrainingDeleteArgs>(args: SelectSubset<T, TrainingDeleteArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Training.
     * @param {TrainingUpdateArgs} args - Arguments to update one Training.
     * @example
     * // Update one Training
     * const training = await prisma.training.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrainingUpdateArgs>(args: SelectSubset<T, TrainingUpdateArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Trainings.
     * @param {TrainingDeleteManyArgs} args - Arguments to filter Trainings to delete.
     * @example
     * // Delete a few Trainings
     * const { count } = await prisma.training.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrainingDeleteManyArgs>(args?: SelectSubset<T, TrainingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trainings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trainings
     * const training = await prisma.training.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrainingUpdateManyArgs>(args: SelectSubset<T, TrainingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Training.
     * @param {TrainingUpsertArgs} args - Arguments to update or create a Training.
     * @example
     * // Update or create a Training
     * const training = await prisma.training.upsert({
     *   create: {
     *     // ... data to create a Training
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Training we want to update
     *   }
     * })
     */
    upsert<T extends TrainingUpsertArgs>(args: SelectSubset<T, TrainingUpsertArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Trainings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingCountArgs} args - Arguments to filter Trainings to count.
     * @example
     * // Count the number of Trainings
     * const count = await prisma.training.count({
     *   where: {
     *     // ... the filter for the Trainings we want to count
     *   }
     * })
    **/
    count<T extends TrainingCountArgs>(
      args?: Subset<T, TrainingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrainingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Training.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrainingAggregateArgs>(args: Subset<T, TrainingAggregateArgs>): Prisma.PrismaPromise<GetTrainingAggregateType<T>>

    /**
     * Group by Training.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrainingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrainingGroupByArgs['orderBy'] }
        : { orderBy?: TrainingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrainingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrainingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Training model
   */
  readonly fields: TrainingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Training.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrainingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enrollments<T extends Training$enrollmentsArgs<ExtArgs> = {}>(args?: Subset<T, Training$enrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Training model
   */ 
  interface TrainingFieldRefs {
    readonly id: FieldRef<"Training", 'String'>
    readonly title: FieldRef<"Training", 'String'>
    readonly code: FieldRef<"Training", 'String'>
    readonly description: FieldRef<"Training", 'String'>
    readonly duration: FieldRef<"Training", 'Int'>
    readonly provider: FieldRef<"Training", 'String'>
    readonly cost: FieldRef<"Training", 'Decimal'>
    readonly maxEnroll: FieldRef<"Training", 'Int'>
    readonly startDate: FieldRef<"Training", 'DateTime'>
    readonly endDate: FieldRef<"Training", 'DateTime'>
    readonly status: FieldRef<"Training", 'TrainingStatus'>
    readonly createdAt: FieldRef<"Training", 'DateTime'>
    readonly updatedAt: FieldRef<"Training", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Training findUnique
   */
  export type TrainingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * Filter, which Training to fetch.
     */
    where: TrainingWhereUniqueInput
  }

  /**
   * Training findUniqueOrThrow
   */
  export type TrainingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * Filter, which Training to fetch.
     */
    where: TrainingWhereUniqueInput
  }

  /**
   * Training findFirst
   */
  export type TrainingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * Filter, which Training to fetch.
     */
    where?: TrainingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trainings to fetch.
     */
    orderBy?: TrainingOrderByWithRelationInput | TrainingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trainings.
     */
    cursor?: TrainingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trainings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trainings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trainings.
     */
    distinct?: TrainingScalarFieldEnum | TrainingScalarFieldEnum[]
  }

  /**
   * Training findFirstOrThrow
   */
  export type TrainingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * Filter, which Training to fetch.
     */
    where?: TrainingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trainings to fetch.
     */
    orderBy?: TrainingOrderByWithRelationInput | TrainingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trainings.
     */
    cursor?: TrainingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trainings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trainings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trainings.
     */
    distinct?: TrainingScalarFieldEnum | TrainingScalarFieldEnum[]
  }

  /**
   * Training findMany
   */
  export type TrainingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * Filter, which Trainings to fetch.
     */
    where?: TrainingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trainings to fetch.
     */
    orderBy?: TrainingOrderByWithRelationInput | TrainingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trainings.
     */
    cursor?: TrainingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trainings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trainings.
     */
    skip?: number
    distinct?: TrainingScalarFieldEnum | TrainingScalarFieldEnum[]
  }

  /**
   * Training create
   */
  export type TrainingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * The data needed to create a Training.
     */
    data: XOR<TrainingCreateInput, TrainingUncheckedCreateInput>
  }

  /**
   * Training createMany
   */
  export type TrainingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trainings.
     */
    data: TrainingCreateManyInput | TrainingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Training createManyAndReturn
   */
  export type TrainingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Trainings.
     */
    data: TrainingCreateManyInput | TrainingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Training update
   */
  export type TrainingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * The data needed to update a Training.
     */
    data: XOR<TrainingUpdateInput, TrainingUncheckedUpdateInput>
    /**
     * Choose, which Training to update.
     */
    where: TrainingWhereUniqueInput
  }

  /**
   * Training updateMany
   */
  export type TrainingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trainings.
     */
    data: XOR<TrainingUpdateManyMutationInput, TrainingUncheckedUpdateManyInput>
    /**
     * Filter which Trainings to update
     */
    where?: TrainingWhereInput
  }

  /**
   * Training upsert
   */
  export type TrainingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * The filter to search for the Training to update in case it exists.
     */
    where: TrainingWhereUniqueInput
    /**
     * In case the Training found by the `where` argument doesn't exist, create a new Training with this data.
     */
    create: XOR<TrainingCreateInput, TrainingUncheckedCreateInput>
    /**
     * In case the Training was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrainingUpdateInput, TrainingUncheckedUpdateInput>
  }

  /**
   * Training delete
   */
  export type TrainingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
    /**
     * Filter which Training to delete.
     */
    where: TrainingWhereUniqueInput
  }

  /**
   * Training deleteMany
   */
  export type TrainingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trainings to delete
     */
    where?: TrainingWhereInput
  }

  /**
   * Training.enrollments
   */
  export type Training$enrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    where?: TrainingEnrollmentWhereInput
    orderBy?: TrainingEnrollmentOrderByWithRelationInput | TrainingEnrollmentOrderByWithRelationInput[]
    cursor?: TrainingEnrollmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrainingEnrollmentScalarFieldEnum | TrainingEnrollmentScalarFieldEnum[]
  }

  /**
   * Training without action
   */
  export type TrainingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Training
     */
    select?: TrainingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingInclude<ExtArgs> | null
  }


  /**
   * Model TrainingEnrollment
   */

  export type AggregateTrainingEnrollment = {
    _count: TrainingEnrollmentCountAggregateOutputType | null
    _avg: TrainingEnrollmentAvgAggregateOutputType | null
    _sum: TrainingEnrollmentSumAggregateOutputType | null
    _min: TrainingEnrollmentMinAggregateOutputType | null
    _max: TrainingEnrollmentMaxAggregateOutputType | null
  }

  export type TrainingEnrollmentAvgAggregateOutputType = {
    score: number | null
  }

  export type TrainingEnrollmentSumAggregateOutputType = {
    score: number | null
  }

  export type TrainingEnrollmentMinAggregateOutputType = {
    id: string | null
    employeeId: string | null
    trainingId: string | null
    enrolledAt: Date | null
    completedAt: Date | null
    score: number | null
    certificate: string | null
    status: string | null
  }

  export type TrainingEnrollmentMaxAggregateOutputType = {
    id: string | null
    employeeId: string | null
    trainingId: string | null
    enrolledAt: Date | null
    completedAt: Date | null
    score: number | null
    certificate: string | null
    status: string | null
  }

  export type TrainingEnrollmentCountAggregateOutputType = {
    id: number
    employeeId: number
    trainingId: number
    enrolledAt: number
    completedAt: number
    score: number
    certificate: number
    status: number
    _all: number
  }


  export type TrainingEnrollmentAvgAggregateInputType = {
    score?: true
  }

  export type TrainingEnrollmentSumAggregateInputType = {
    score?: true
  }

  export type TrainingEnrollmentMinAggregateInputType = {
    id?: true
    employeeId?: true
    trainingId?: true
    enrolledAt?: true
    completedAt?: true
    score?: true
    certificate?: true
    status?: true
  }

  export type TrainingEnrollmentMaxAggregateInputType = {
    id?: true
    employeeId?: true
    trainingId?: true
    enrolledAt?: true
    completedAt?: true
    score?: true
    certificate?: true
    status?: true
  }

  export type TrainingEnrollmentCountAggregateInputType = {
    id?: true
    employeeId?: true
    trainingId?: true
    enrolledAt?: true
    completedAt?: true
    score?: true
    certificate?: true
    status?: true
    _all?: true
  }

  export type TrainingEnrollmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrainingEnrollment to aggregate.
     */
    where?: TrainingEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainingEnrollments to fetch.
     */
    orderBy?: TrainingEnrollmentOrderByWithRelationInput | TrainingEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrainingEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainingEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainingEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrainingEnrollments
    **/
    _count?: true | TrainingEnrollmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrainingEnrollmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrainingEnrollmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrainingEnrollmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrainingEnrollmentMaxAggregateInputType
  }

  export type GetTrainingEnrollmentAggregateType<T extends TrainingEnrollmentAggregateArgs> = {
        [P in keyof T & keyof AggregateTrainingEnrollment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrainingEnrollment[P]>
      : GetScalarType<T[P], AggregateTrainingEnrollment[P]>
  }




  export type TrainingEnrollmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrainingEnrollmentWhereInput
    orderBy?: TrainingEnrollmentOrderByWithAggregationInput | TrainingEnrollmentOrderByWithAggregationInput[]
    by: TrainingEnrollmentScalarFieldEnum[] | TrainingEnrollmentScalarFieldEnum
    having?: TrainingEnrollmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrainingEnrollmentCountAggregateInputType | true
    _avg?: TrainingEnrollmentAvgAggregateInputType
    _sum?: TrainingEnrollmentSumAggregateInputType
    _min?: TrainingEnrollmentMinAggregateInputType
    _max?: TrainingEnrollmentMaxAggregateInputType
  }

  export type TrainingEnrollmentGroupByOutputType = {
    id: string
    employeeId: string
    trainingId: string
    enrolledAt: Date
    completedAt: Date | null
    score: number | null
    certificate: string | null
    status: string
    _count: TrainingEnrollmentCountAggregateOutputType | null
    _avg: TrainingEnrollmentAvgAggregateOutputType | null
    _sum: TrainingEnrollmentSumAggregateOutputType | null
    _min: TrainingEnrollmentMinAggregateOutputType | null
    _max: TrainingEnrollmentMaxAggregateOutputType | null
  }

  type GetTrainingEnrollmentGroupByPayload<T extends TrainingEnrollmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrainingEnrollmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrainingEnrollmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrainingEnrollmentGroupByOutputType[P]>
            : GetScalarType<T[P], TrainingEnrollmentGroupByOutputType[P]>
        }
      >
    >


  export type TrainingEnrollmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    trainingId?: boolean
    enrolledAt?: boolean
    completedAt?: boolean
    score?: boolean
    certificate?: boolean
    status?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    training?: boolean | TrainingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trainingEnrollment"]>

  export type TrainingEnrollmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    employeeId?: boolean
    trainingId?: boolean
    enrolledAt?: boolean
    completedAt?: boolean
    score?: boolean
    certificate?: boolean
    status?: boolean
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    training?: boolean | TrainingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trainingEnrollment"]>

  export type TrainingEnrollmentSelectScalar = {
    id?: boolean
    employeeId?: boolean
    trainingId?: boolean
    enrolledAt?: boolean
    completedAt?: boolean
    score?: boolean
    certificate?: boolean
    status?: boolean
  }

  export type TrainingEnrollmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    training?: boolean | TrainingDefaultArgs<ExtArgs>
  }
  export type TrainingEnrollmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    employee?: boolean | EmployeeDefaultArgs<ExtArgs>
    training?: boolean | TrainingDefaultArgs<ExtArgs>
  }

  export type $TrainingEnrollmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrainingEnrollment"
    objects: {
      employee: Prisma.$EmployeePayload<ExtArgs>
      training: Prisma.$TrainingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      employeeId: string
      trainingId: string
      enrolledAt: Date
      completedAt: Date | null
      score: number | null
      certificate: string | null
      status: string
    }, ExtArgs["result"]["trainingEnrollment"]>
    composites: {}
  }

  type TrainingEnrollmentGetPayload<S extends boolean | null | undefined | TrainingEnrollmentDefaultArgs> = $Result.GetResult<Prisma.$TrainingEnrollmentPayload, S>

  type TrainingEnrollmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TrainingEnrollmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TrainingEnrollmentCountAggregateInputType | true
    }

  export interface TrainingEnrollmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrainingEnrollment'], meta: { name: 'TrainingEnrollment' } }
    /**
     * Find zero or one TrainingEnrollment that matches the filter.
     * @param {TrainingEnrollmentFindUniqueArgs} args - Arguments to find a TrainingEnrollment
     * @example
     * // Get one TrainingEnrollment
     * const trainingEnrollment = await prisma.trainingEnrollment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrainingEnrollmentFindUniqueArgs>(args: SelectSubset<T, TrainingEnrollmentFindUniqueArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TrainingEnrollment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TrainingEnrollmentFindUniqueOrThrowArgs} args - Arguments to find a TrainingEnrollment
     * @example
     * // Get one TrainingEnrollment
     * const trainingEnrollment = await prisma.trainingEnrollment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrainingEnrollmentFindUniqueOrThrowArgs>(args: SelectSubset<T, TrainingEnrollmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TrainingEnrollment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentFindFirstArgs} args - Arguments to find a TrainingEnrollment
     * @example
     * // Get one TrainingEnrollment
     * const trainingEnrollment = await prisma.trainingEnrollment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrainingEnrollmentFindFirstArgs>(args?: SelectSubset<T, TrainingEnrollmentFindFirstArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TrainingEnrollment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentFindFirstOrThrowArgs} args - Arguments to find a TrainingEnrollment
     * @example
     * // Get one TrainingEnrollment
     * const trainingEnrollment = await prisma.trainingEnrollment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrainingEnrollmentFindFirstOrThrowArgs>(args?: SelectSubset<T, TrainingEnrollmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TrainingEnrollments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrainingEnrollments
     * const trainingEnrollments = await prisma.trainingEnrollment.findMany()
     * 
     * // Get first 10 TrainingEnrollments
     * const trainingEnrollments = await prisma.trainingEnrollment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trainingEnrollmentWithIdOnly = await prisma.trainingEnrollment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrainingEnrollmentFindManyArgs>(args?: SelectSubset<T, TrainingEnrollmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TrainingEnrollment.
     * @param {TrainingEnrollmentCreateArgs} args - Arguments to create a TrainingEnrollment.
     * @example
     * // Create one TrainingEnrollment
     * const TrainingEnrollment = await prisma.trainingEnrollment.create({
     *   data: {
     *     // ... data to create a TrainingEnrollment
     *   }
     * })
     * 
     */
    create<T extends TrainingEnrollmentCreateArgs>(args: SelectSubset<T, TrainingEnrollmentCreateArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TrainingEnrollments.
     * @param {TrainingEnrollmentCreateManyArgs} args - Arguments to create many TrainingEnrollments.
     * @example
     * // Create many TrainingEnrollments
     * const trainingEnrollment = await prisma.trainingEnrollment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrainingEnrollmentCreateManyArgs>(args?: SelectSubset<T, TrainingEnrollmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrainingEnrollments and returns the data saved in the database.
     * @param {TrainingEnrollmentCreateManyAndReturnArgs} args - Arguments to create many TrainingEnrollments.
     * @example
     * // Create many TrainingEnrollments
     * const trainingEnrollment = await prisma.trainingEnrollment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrainingEnrollments and only return the `id`
     * const trainingEnrollmentWithIdOnly = await prisma.trainingEnrollment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrainingEnrollmentCreateManyAndReturnArgs>(args?: SelectSubset<T, TrainingEnrollmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TrainingEnrollment.
     * @param {TrainingEnrollmentDeleteArgs} args - Arguments to delete one TrainingEnrollment.
     * @example
     * // Delete one TrainingEnrollment
     * const TrainingEnrollment = await prisma.trainingEnrollment.delete({
     *   where: {
     *     // ... filter to delete one TrainingEnrollment
     *   }
     * })
     * 
     */
    delete<T extends TrainingEnrollmentDeleteArgs>(args: SelectSubset<T, TrainingEnrollmentDeleteArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TrainingEnrollment.
     * @param {TrainingEnrollmentUpdateArgs} args - Arguments to update one TrainingEnrollment.
     * @example
     * // Update one TrainingEnrollment
     * const trainingEnrollment = await prisma.trainingEnrollment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrainingEnrollmentUpdateArgs>(args: SelectSubset<T, TrainingEnrollmentUpdateArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TrainingEnrollments.
     * @param {TrainingEnrollmentDeleteManyArgs} args - Arguments to filter TrainingEnrollments to delete.
     * @example
     * // Delete a few TrainingEnrollments
     * const { count } = await prisma.trainingEnrollment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrainingEnrollmentDeleteManyArgs>(args?: SelectSubset<T, TrainingEnrollmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrainingEnrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrainingEnrollments
     * const trainingEnrollment = await prisma.trainingEnrollment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrainingEnrollmentUpdateManyArgs>(args: SelectSubset<T, TrainingEnrollmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TrainingEnrollment.
     * @param {TrainingEnrollmentUpsertArgs} args - Arguments to update or create a TrainingEnrollment.
     * @example
     * // Update or create a TrainingEnrollment
     * const trainingEnrollment = await prisma.trainingEnrollment.upsert({
     *   create: {
     *     // ... data to create a TrainingEnrollment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrainingEnrollment we want to update
     *   }
     * })
     */
    upsert<T extends TrainingEnrollmentUpsertArgs>(args: SelectSubset<T, TrainingEnrollmentUpsertArgs<ExtArgs>>): Prisma__TrainingEnrollmentClient<$Result.GetResult<Prisma.$TrainingEnrollmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TrainingEnrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentCountArgs} args - Arguments to filter TrainingEnrollments to count.
     * @example
     * // Count the number of TrainingEnrollments
     * const count = await prisma.trainingEnrollment.count({
     *   where: {
     *     // ... the filter for the TrainingEnrollments we want to count
     *   }
     * })
    **/
    count<T extends TrainingEnrollmentCountArgs>(
      args?: Subset<T, TrainingEnrollmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrainingEnrollmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrainingEnrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrainingEnrollmentAggregateArgs>(args: Subset<T, TrainingEnrollmentAggregateArgs>): Prisma.PrismaPromise<GetTrainingEnrollmentAggregateType<T>>

    /**
     * Group by TrainingEnrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrainingEnrollmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrainingEnrollmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrainingEnrollmentGroupByArgs['orderBy'] }
        : { orderBy?: TrainingEnrollmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrainingEnrollmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrainingEnrollmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrainingEnrollment model
   */
  readonly fields: TrainingEnrollmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrainingEnrollment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrainingEnrollmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    employee<T extends EmployeeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmployeeDefaultArgs<ExtArgs>>): Prisma__EmployeeClient<$Result.GetResult<Prisma.$EmployeePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    training<T extends TrainingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TrainingDefaultArgs<ExtArgs>>): Prisma__TrainingClient<$Result.GetResult<Prisma.$TrainingPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrainingEnrollment model
   */ 
  interface TrainingEnrollmentFieldRefs {
    readonly id: FieldRef<"TrainingEnrollment", 'String'>
    readonly employeeId: FieldRef<"TrainingEnrollment", 'String'>
    readonly trainingId: FieldRef<"TrainingEnrollment", 'String'>
    readonly enrolledAt: FieldRef<"TrainingEnrollment", 'DateTime'>
    readonly completedAt: FieldRef<"TrainingEnrollment", 'DateTime'>
    readonly score: FieldRef<"TrainingEnrollment", 'Int'>
    readonly certificate: FieldRef<"TrainingEnrollment", 'String'>
    readonly status: FieldRef<"TrainingEnrollment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TrainingEnrollment findUnique
   */
  export type TrainingEnrollmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which TrainingEnrollment to fetch.
     */
    where: TrainingEnrollmentWhereUniqueInput
  }

  /**
   * TrainingEnrollment findUniqueOrThrow
   */
  export type TrainingEnrollmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which TrainingEnrollment to fetch.
     */
    where: TrainingEnrollmentWhereUniqueInput
  }

  /**
   * TrainingEnrollment findFirst
   */
  export type TrainingEnrollmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which TrainingEnrollment to fetch.
     */
    where?: TrainingEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainingEnrollments to fetch.
     */
    orderBy?: TrainingEnrollmentOrderByWithRelationInput | TrainingEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrainingEnrollments.
     */
    cursor?: TrainingEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainingEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainingEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrainingEnrollments.
     */
    distinct?: TrainingEnrollmentScalarFieldEnum | TrainingEnrollmentScalarFieldEnum[]
  }

  /**
   * TrainingEnrollment findFirstOrThrow
   */
  export type TrainingEnrollmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which TrainingEnrollment to fetch.
     */
    where?: TrainingEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainingEnrollments to fetch.
     */
    orderBy?: TrainingEnrollmentOrderByWithRelationInput | TrainingEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrainingEnrollments.
     */
    cursor?: TrainingEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainingEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainingEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrainingEnrollments.
     */
    distinct?: TrainingEnrollmentScalarFieldEnum | TrainingEnrollmentScalarFieldEnum[]
  }

  /**
   * TrainingEnrollment findMany
   */
  export type TrainingEnrollmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * Filter, which TrainingEnrollments to fetch.
     */
    where?: TrainingEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrainingEnrollments to fetch.
     */
    orderBy?: TrainingEnrollmentOrderByWithRelationInput | TrainingEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrainingEnrollments.
     */
    cursor?: TrainingEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrainingEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrainingEnrollments.
     */
    skip?: number
    distinct?: TrainingEnrollmentScalarFieldEnum | TrainingEnrollmentScalarFieldEnum[]
  }

  /**
   * TrainingEnrollment create
   */
  export type TrainingEnrollmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * The data needed to create a TrainingEnrollment.
     */
    data: XOR<TrainingEnrollmentCreateInput, TrainingEnrollmentUncheckedCreateInput>
  }

  /**
   * TrainingEnrollment createMany
   */
  export type TrainingEnrollmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrainingEnrollments.
     */
    data: TrainingEnrollmentCreateManyInput | TrainingEnrollmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrainingEnrollment createManyAndReturn
   */
  export type TrainingEnrollmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TrainingEnrollments.
     */
    data: TrainingEnrollmentCreateManyInput | TrainingEnrollmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrainingEnrollment update
   */
  export type TrainingEnrollmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * The data needed to update a TrainingEnrollment.
     */
    data: XOR<TrainingEnrollmentUpdateInput, TrainingEnrollmentUncheckedUpdateInput>
    /**
     * Choose, which TrainingEnrollment to update.
     */
    where: TrainingEnrollmentWhereUniqueInput
  }

  /**
   * TrainingEnrollment updateMany
   */
  export type TrainingEnrollmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrainingEnrollments.
     */
    data: XOR<TrainingEnrollmentUpdateManyMutationInput, TrainingEnrollmentUncheckedUpdateManyInput>
    /**
     * Filter which TrainingEnrollments to update
     */
    where?: TrainingEnrollmentWhereInput
  }

  /**
   * TrainingEnrollment upsert
   */
  export type TrainingEnrollmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * The filter to search for the TrainingEnrollment to update in case it exists.
     */
    where: TrainingEnrollmentWhereUniqueInput
    /**
     * In case the TrainingEnrollment found by the `where` argument doesn't exist, create a new TrainingEnrollment with this data.
     */
    create: XOR<TrainingEnrollmentCreateInput, TrainingEnrollmentUncheckedCreateInput>
    /**
     * In case the TrainingEnrollment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrainingEnrollmentUpdateInput, TrainingEnrollmentUncheckedUpdateInput>
  }

  /**
   * TrainingEnrollment delete
   */
  export type TrainingEnrollmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
    /**
     * Filter which TrainingEnrollment to delete.
     */
    where: TrainingEnrollmentWhereUniqueInput
  }

  /**
   * TrainingEnrollment deleteMany
   */
  export type TrainingEnrollmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrainingEnrollments to delete
     */
    where?: TrainingEnrollmentWhereInput
  }

  /**
   * TrainingEnrollment without action
   */
  export type TrainingEnrollmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrainingEnrollment
     */
    select?: TrainingEnrollmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrainingEnrollmentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const HrUserScalarFieldEnum: {
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

  export type HrUserScalarFieldEnum = (typeof HrUserScalarFieldEnum)[keyof typeof HrUserScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
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

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const PositionScalarFieldEnum: {
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

  export type PositionScalarFieldEnum = (typeof PositionScalarFieldEnum)[keyof typeof PositionScalarFieldEnum]


  export const EmployeeScalarFieldEnum: {
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

  export type EmployeeScalarFieldEnum = (typeof EmployeeScalarFieldEnum)[keyof typeof EmployeeScalarFieldEnum]


  export const AttendanceScalarFieldEnum: {
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

  export type AttendanceScalarFieldEnum = (typeof AttendanceScalarFieldEnum)[keyof typeof AttendanceScalarFieldEnum]


  export const ShiftScalarFieldEnum: {
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

  export type ShiftScalarFieldEnum = (typeof ShiftScalarFieldEnum)[keyof typeof ShiftScalarFieldEnum]


  export const ShiftAssignmentScalarFieldEnum: {
    id: 'id',
    employeeId: 'employeeId',
    shiftId: 'shiftId',
    date: 'date',
    createdAt: 'createdAt'
  };

  export type ShiftAssignmentScalarFieldEnum = (typeof ShiftAssignmentScalarFieldEnum)[keyof typeof ShiftAssignmentScalarFieldEnum]


  export const LeaveRequestScalarFieldEnum: {
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

  export type LeaveRequestScalarFieldEnum = (typeof LeaveRequestScalarFieldEnum)[keyof typeof LeaveRequestScalarFieldEnum]


  export const PayrollScalarFieldEnum: {
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

  export type PayrollScalarFieldEnum = (typeof PayrollScalarFieldEnum)[keyof typeof PayrollScalarFieldEnum]


  export const PerformanceReviewScalarFieldEnum: {
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

  export type PerformanceReviewScalarFieldEnum = (typeof PerformanceReviewScalarFieldEnum)[keyof typeof PerformanceReviewScalarFieldEnum]


  export const TrainingScalarFieldEnum: {
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

  export type TrainingScalarFieldEnum = (typeof TrainingScalarFieldEnum)[keyof typeof TrainingScalarFieldEnum]


  export const TrainingEnrollmentScalarFieldEnum: {
    id: 'id',
    employeeId: 'employeeId',
    trainingId: 'trainingId',
    enrolledAt: 'enrolledAt',
    completedAt: 'completedAt',
    score: 'score',
    certificate: 'certificate',
    status: 'status'
  };

  export type TrainingEnrollmentScalarFieldEnum = (typeof TrainingEnrollmentScalarFieldEnum)[keyof typeof TrainingEnrollmentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'DepartmentType'
   */
  export type EnumDepartmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DepartmentType'>
    


  /**
   * Reference to a field of type 'DepartmentType[]'
   */
  export type ListEnumDepartmentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DepartmentType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'EmployeeStatus'
   */
  export type EnumEmployeeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EmployeeStatus'>
    


  /**
   * Reference to a field of type 'EmployeeStatus[]'
   */
  export type ListEnumEmployeeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EmployeeStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'AttendanceStatus'
   */
  export type EnumAttendanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttendanceStatus'>
    


  /**
   * Reference to a field of type 'AttendanceStatus[]'
   */
  export type ListEnumAttendanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttendanceStatus[]'>
    


  /**
   * Reference to a field of type 'LeaveType'
   */
  export type EnumLeaveTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeaveType'>
    


  /**
   * Reference to a field of type 'LeaveType[]'
   */
  export type ListEnumLeaveTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeaveType[]'>
    


  /**
   * Reference to a field of type 'LeaveStatus'
   */
  export type EnumLeaveStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeaveStatus'>
    


  /**
   * Reference to a field of type 'LeaveStatus[]'
   */
  export type ListEnumLeaveStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeaveStatus[]'>
    


  /**
   * Reference to a field of type 'PayrollStatus'
   */
  export type EnumPayrollStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollStatus'>
    


  /**
   * Reference to a field of type 'PayrollStatus[]'
   */
  export type ListEnumPayrollStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollStatus[]'>
    


  /**
   * Reference to a field of type 'PerformanceRating'
   */
  export type EnumPerformanceRatingFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PerformanceRating'>
    


  /**
   * Reference to a field of type 'PerformanceRating[]'
   */
  export type ListEnumPerformanceRatingFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PerformanceRating[]'>
    


  /**
   * Reference to a field of type 'TrainingStatus'
   */
  export type EnumTrainingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrainingStatus'>
    


  /**
   * Reference to a field of type 'TrainingStatus[]'
   */
  export type ListEnumTrainingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrainingStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type HrUserWhereInput = {
    AND?: HrUserWhereInput | HrUserWhereInput[]
    OR?: HrUserWhereInput[]
    NOT?: HrUserWhereInput | HrUserWhereInput[]
    id?: StringFilter<"HrUser"> | string
    tollgateUserId?: StringFilter<"HrUser"> | string
    email?: StringFilter<"HrUser"> | string
    name?: StringFilter<"HrUser"> | string
    role?: StringFilter<"HrUser"> | string
    status?: StringFilter<"HrUser"> | string
    lastLoginAt?: DateTimeNullableFilter<"HrUser"> | Date | string | null
    createdAt?: DateTimeFilter<"HrUser"> | Date | string
    updatedAt?: DateTimeFilter<"HrUser"> | Date | string
  }

  export type HrUserOrderByWithRelationInput = {
    id?: SortOrder
    tollgateUserId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HrUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tollgateUserId?: string
    email?: string
    AND?: HrUserWhereInput | HrUserWhereInput[]
    OR?: HrUserWhereInput[]
    NOT?: HrUserWhereInput | HrUserWhereInput[]
    name?: StringFilter<"HrUser"> | string
    role?: StringFilter<"HrUser"> | string
    status?: StringFilter<"HrUser"> | string
    lastLoginAt?: DateTimeNullableFilter<"HrUser"> | Date | string | null
    createdAt?: DateTimeFilter<"HrUser"> | Date | string
    updatedAt?: DateTimeFilter<"HrUser"> | Date | string
  }, "id" | "tollgateUserId" | "email">

  export type HrUserOrderByWithAggregationInput = {
    id?: SortOrder
    tollgateUserId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HrUserCountOrderByAggregateInput
    _max?: HrUserMaxOrderByAggregateInput
    _min?: HrUserMinOrderByAggregateInput
  }

  export type HrUserScalarWhereWithAggregatesInput = {
    AND?: HrUserScalarWhereWithAggregatesInput | HrUserScalarWhereWithAggregatesInput[]
    OR?: HrUserScalarWhereWithAggregatesInput[]
    NOT?: HrUserScalarWhereWithAggregatesInput | HrUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HrUser"> | string
    tollgateUserId?: StringWithAggregatesFilter<"HrUser"> | string
    email?: StringWithAggregatesFilter<"HrUser"> | string
    name?: StringWithAggregatesFilter<"HrUser"> | string
    role?: StringWithAggregatesFilter<"HrUser"> | string
    status?: StringWithAggregatesFilter<"HrUser"> | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"HrUser"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"HrUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"HrUser"> | Date | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    code?: StringFilter<"Department"> | string
    type?: EnumDepartmentTypeFilter<"Department"> | $Enums.DepartmentType
    description?: StringNullableFilter<"Department"> | string | null
    managerId?: StringNullableFilter<"Department"> | string | null
    parentId?: StringNullableFilter<"Department"> | string | null
    status?: StringFilter<"Department"> | string
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    employees?: EmployeeListRelationFilter
    positions?: PositionListRelationFilter
    parent?: XOR<DepartmentNullableRelationFilter, DepartmentWhereInput> | null
    children?: DepartmentListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    type?: SortOrder
    description?: SortOrderInput | SortOrder
    managerId?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    employees?: EmployeeOrderByRelationAggregateInput
    positions?: PositionOrderByRelationAggregateInput
    parent?: DepartmentOrderByWithRelationInput
    children?: DepartmentOrderByRelationAggregateInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    code?: string
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    type?: EnumDepartmentTypeFilter<"Department"> | $Enums.DepartmentType
    description?: StringNullableFilter<"Department"> | string | null
    managerId?: StringNullableFilter<"Department"> | string | null
    parentId?: StringNullableFilter<"Department"> | string | null
    status?: StringFilter<"Department"> | string
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
    employees?: EmployeeListRelationFilter
    positions?: PositionListRelationFilter
    parent?: XOR<DepartmentNullableRelationFilter, DepartmentWhereInput> | null
    children?: DepartmentListRelationFilter
  }, "id" | "name" | "code">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    type?: SortOrder
    description?: SortOrderInput | SortOrder
    managerId?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Department"> | string
    name?: StringWithAggregatesFilter<"Department"> | string
    code?: StringWithAggregatesFilter<"Department"> | string
    type?: EnumDepartmentTypeWithAggregatesFilter<"Department"> | $Enums.DepartmentType
    description?: StringNullableWithAggregatesFilter<"Department"> | string | null
    managerId?: StringNullableWithAggregatesFilter<"Department"> | string | null
    parentId?: StringNullableWithAggregatesFilter<"Department"> | string | null
    status?: StringWithAggregatesFilter<"Department"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Department"> | Date | string
  }

  export type PositionWhereInput = {
    AND?: PositionWhereInput | PositionWhereInput[]
    OR?: PositionWhereInput[]
    NOT?: PositionWhereInput | PositionWhereInput[]
    id?: StringFilter<"Position"> | string
    title?: StringFilter<"Position"> | string
    code?: StringFilter<"Position"> | string
    departmentId?: StringFilter<"Position"> | string
    level?: IntFilter<"Position"> | number
    minSalary?: DecimalNullableFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    maxSalary?: DecimalNullableFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    description?: StringNullableFilter<"Position"> | string | null
    status?: StringFilter<"Position"> | string
    createdAt?: DateTimeFilter<"Position"> | Date | string
    updatedAt?: DateTimeFilter<"Position"> | Date | string
    employees?: EmployeeListRelationFilter
    department?: XOR<DepartmentRelationFilter, DepartmentWhereInput>
  }

  export type PositionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    departmentId?: SortOrder
    level?: SortOrder
    minSalary?: SortOrderInput | SortOrder
    maxSalary?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    employees?: EmployeeOrderByRelationAggregateInput
    department?: DepartmentOrderByWithRelationInput
  }

  export type PositionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: PositionWhereInput | PositionWhereInput[]
    OR?: PositionWhereInput[]
    NOT?: PositionWhereInput | PositionWhereInput[]
    title?: StringFilter<"Position"> | string
    departmentId?: StringFilter<"Position"> | string
    level?: IntFilter<"Position"> | number
    minSalary?: DecimalNullableFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    maxSalary?: DecimalNullableFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    description?: StringNullableFilter<"Position"> | string | null
    status?: StringFilter<"Position"> | string
    createdAt?: DateTimeFilter<"Position"> | Date | string
    updatedAt?: DateTimeFilter<"Position"> | Date | string
    employees?: EmployeeListRelationFilter
    department?: XOR<DepartmentRelationFilter, DepartmentWhereInput>
  }, "id" | "code">

  export type PositionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    departmentId?: SortOrder
    level?: SortOrder
    minSalary?: SortOrderInput | SortOrder
    maxSalary?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PositionCountOrderByAggregateInput
    _avg?: PositionAvgOrderByAggregateInput
    _max?: PositionMaxOrderByAggregateInput
    _min?: PositionMinOrderByAggregateInput
    _sum?: PositionSumOrderByAggregateInput
  }

  export type PositionScalarWhereWithAggregatesInput = {
    AND?: PositionScalarWhereWithAggregatesInput | PositionScalarWhereWithAggregatesInput[]
    OR?: PositionScalarWhereWithAggregatesInput[]
    NOT?: PositionScalarWhereWithAggregatesInput | PositionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Position"> | string
    title?: StringWithAggregatesFilter<"Position"> | string
    code?: StringWithAggregatesFilter<"Position"> | string
    departmentId?: StringWithAggregatesFilter<"Position"> | string
    level?: IntWithAggregatesFilter<"Position"> | number
    minSalary?: DecimalNullableWithAggregatesFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    maxSalary?: DecimalNullableWithAggregatesFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    description?: StringNullableWithAggregatesFilter<"Position"> | string | null
    status?: StringWithAggregatesFilter<"Position"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Position"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Position"> | Date | string
  }

  export type EmployeeWhereInput = {
    AND?: EmployeeWhereInput | EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]
    NOT?: EmployeeWhereInput | EmployeeWhereInput[]
    id?: StringFilter<"Employee"> | string
    employeeNumber?: StringFilter<"Employee"> | string
    tollgateUserId?: StringNullableFilter<"Employee"> | string | null
    firstName?: StringFilter<"Employee"> | string
    lastName?: StringFilter<"Employee"> | string
    email?: StringFilter<"Employee"> | string
    phone?: StringNullableFilter<"Employee"> | string | null
    nrcNumber?: StringNullableFilter<"Employee"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Employee"> | Date | string | null
    gender?: StringNullableFilter<"Employee"> | string | null
    address?: StringNullableFilter<"Employee"> | string | null
    emergencyContact?: StringNullableFilter<"Employee"> | string | null
    emergencyPhone?: StringNullableFilter<"Employee"> | string | null
    departmentId?: StringFilter<"Employee"> | string
    positionId?: StringFilter<"Employee"> | string
    managerId?: StringNullableFilter<"Employee"> | string | null
    hireDate?: DateTimeFilter<"Employee"> | Date | string
    salary?: DecimalFilter<"Employee"> | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFilter<"Employee"> | $Enums.EmployeeStatus
    terminationDate?: DateTimeNullableFilter<"Employee"> | Date | string | null
    profilePhoto?: StringNullableFilter<"Employee"> | string | null
    notes?: StringNullableFilter<"Employee"> | string | null
    metadata?: JsonNullableFilter<"Employee">
    createdAt?: DateTimeFilter<"Employee"> | Date | string
    updatedAt?: DateTimeFilter<"Employee"> | Date | string
    department?: XOR<DepartmentRelationFilter, DepartmentWhereInput>
    position?: XOR<PositionRelationFilter, PositionWhereInput>
    manager?: XOR<EmployeeNullableRelationFilter, EmployeeWhereInput> | null
    directReports?: EmployeeListRelationFilter
    attendances?: AttendanceListRelationFilter
    shiftAssignments?: ShiftAssignmentListRelationFilter
    leaveRequests?: LeaveRequestListRelationFilter
    payrolls?: PayrollListRelationFilter
    performances?: PerformanceReviewListRelationFilter
    trainingEnrollments?: TrainingEnrollmentListRelationFilter
  }

  export type EmployeeOrderByWithRelationInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    tollgateUserId?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    nrcNumber?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    emergencyContact?: SortOrderInput | SortOrder
    emergencyPhone?: SortOrderInput | SortOrder
    departmentId?: SortOrder
    positionId?: SortOrder
    managerId?: SortOrderInput | SortOrder
    hireDate?: SortOrder
    salary?: SortOrder
    status?: SortOrder
    terminationDate?: SortOrderInput | SortOrder
    profilePhoto?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    department?: DepartmentOrderByWithRelationInput
    position?: PositionOrderByWithRelationInput
    manager?: EmployeeOrderByWithRelationInput
    directReports?: EmployeeOrderByRelationAggregateInput
    attendances?: AttendanceOrderByRelationAggregateInput
    shiftAssignments?: ShiftAssignmentOrderByRelationAggregateInput
    leaveRequests?: LeaveRequestOrderByRelationAggregateInput
    payrolls?: PayrollOrderByRelationAggregateInput
    performances?: PerformanceReviewOrderByRelationAggregateInput
    trainingEnrollments?: TrainingEnrollmentOrderByRelationAggregateInput
  }

  export type EmployeeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    employeeNumber?: string
    tollgateUserId?: string
    email?: string
    AND?: EmployeeWhereInput | EmployeeWhereInput[]
    OR?: EmployeeWhereInput[]
    NOT?: EmployeeWhereInput | EmployeeWhereInput[]
    firstName?: StringFilter<"Employee"> | string
    lastName?: StringFilter<"Employee"> | string
    phone?: StringNullableFilter<"Employee"> | string | null
    nrcNumber?: StringNullableFilter<"Employee"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Employee"> | Date | string | null
    gender?: StringNullableFilter<"Employee"> | string | null
    address?: StringNullableFilter<"Employee"> | string | null
    emergencyContact?: StringNullableFilter<"Employee"> | string | null
    emergencyPhone?: StringNullableFilter<"Employee"> | string | null
    departmentId?: StringFilter<"Employee"> | string
    positionId?: StringFilter<"Employee"> | string
    managerId?: StringNullableFilter<"Employee"> | string | null
    hireDate?: DateTimeFilter<"Employee"> | Date | string
    salary?: DecimalFilter<"Employee"> | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFilter<"Employee"> | $Enums.EmployeeStatus
    terminationDate?: DateTimeNullableFilter<"Employee"> | Date | string | null
    profilePhoto?: StringNullableFilter<"Employee"> | string | null
    notes?: StringNullableFilter<"Employee"> | string | null
    metadata?: JsonNullableFilter<"Employee">
    createdAt?: DateTimeFilter<"Employee"> | Date | string
    updatedAt?: DateTimeFilter<"Employee"> | Date | string
    department?: XOR<DepartmentRelationFilter, DepartmentWhereInput>
    position?: XOR<PositionRelationFilter, PositionWhereInput>
    manager?: XOR<EmployeeNullableRelationFilter, EmployeeWhereInput> | null
    directReports?: EmployeeListRelationFilter
    attendances?: AttendanceListRelationFilter
    shiftAssignments?: ShiftAssignmentListRelationFilter
    leaveRequests?: LeaveRequestListRelationFilter
    payrolls?: PayrollListRelationFilter
    performances?: PerformanceReviewListRelationFilter
    trainingEnrollments?: TrainingEnrollmentListRelationFilter
  }, "id" | "employeeNumber" | "tollgateUserId" | "email">

  export type EmployeeOrderByWithAggregationInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    tollgateUserId?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    nrcNumber?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    emergencyContact?: SortOrderInput | SortOrder
    emergencyPhone?: SortOrderInput | SortOrder
    departmentId?: SortOrder
    positionId?: SortOrder
    managerId?: SortOrderInput | SortOrder
    hireDate?: SortOrder
    salary?: SortOrder
    status?: SortOrder
    terminationDate?: SortOrderInput | SortOrder
    profilePhoto?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EmployeeCountOrderByAggregateInput
    _avg?: EmployeeAvgOrderByAggregateInput
    _max?: EmployeeMaxOrderByAggregateInput
    _min?: EmployeeMinOrderByAggregateInput
    _sum?: EmployeeSumOrderByAggregateInput
  }

  export type EmployeeScalarWhereWithAggregatesInput = {
    AND?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[]
    OR?: EmployeeScalarWhereWithAggregatesInput[]
    NOT?: EmployeeScalarWhereWithAggregatesInput | EmployeeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Employee"> | string
    employeeNumber?: StringWithAggregatesFilter<"Employee"> | string
    tollgateUserId?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    firstName?: StringWithAggregatesFilter<"Employee"> | string
    lastName?: StringWithAggregatesFilter<"Employee"> | string
    email?: StringWithAggregatesFilter<"Employee"> | string
    phone?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    nrcNumber?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"Employee"> | Date | string | null
    gender?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    address?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    emergencyContact?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    emergencyPhone?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    departmentId?: StringWithAggregatesFilter<"Employee"> | string
    positionId?: StringWithAggregatesFilter<"Employee"> | string
    managerId?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    hireDate?: DateTimeWithAggregatesFilter<"Employee"> | Date | string
    salary?: DecimalWithAggregatesFilter<"Employee"> | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusWithAggregatesFilter<"Employee"> | $Enums.EmployeeStatus
    terminationDate?: DateTimeNullableWithAggregatesFilter<"Employee"> | Date | string | null
    profilePhoto?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Employee"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Employee">
    createdAt?: DateTimeWithAggregatesFilter<"Employee"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Employee"> | Date | string
  }

  export type AttendanceWhereInput = {
    AND?: AttendanceWhereInput | AttendanceWhereInput[]
    OR?: AttendanceWhereInput[]
    NOT?: AttendanceWhereInput | AttendanceWhereInput[]
    id?: StringFilter<"Attendance"> | string
    employeeId?: StringFilter<"Attendance"> | string
    date?: DateTimeFilter<"Attendance"> | Date | string
    clockIn?: DateTimeNullableFilter<"Attendance"> | Date | string | null
    clockOut?: DateTimeNullableFilter<"Attendance"> | Date | string | null
    status?: EnumAttendanceStatusFilter<"Attendance"> | $Enums.AttendanceStatus
    hoursWorked?: DecimalNullableFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    overtime?: DecimalNullableFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"Attendance"> | string | null
    createdAt?: DateTimeFilter<"Attendance"> | Date | string
    updatedAt?: DateTimeFilter<"Attendance"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }

  export type AttendanceOrderByWithRelationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    date?: SortOrder
    clockIn?: SortOrderInput | SortOrder
    clockOut?: SortOrderInput | SortOrder
    status?: SortOrder
    hoursWorked?: SortOrderInput | SortOrder
    overtime?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    employee?: EmployeeOrderByWithRelationInput
  }

  export type AttendanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    employeeId_date?: AttendanceEmployeeIdDateCompoundUniqueInput
    AND?: AttendanceWhereInput | AttendanceWhereInput[]
    OR?: AttendanceWhereInput[]
    NOT?: AttendanceWhereInput | AttendanceWhereInput[]
    employeeId?: StringFilter<"Attendance"> | string
    date?: DateTimeFilter<"Attendance"> | Date | string
    clockIn?: DateTimeNullableFilter<"Attendance"> | Date | string | null
    clockOut?: DateTimeNullableFilter<"Attendance"> | Date | string | null
    status?: EnumAttendanceStatusFilter<"Attendance"> | $Enums.AttendanceStatus
    hoursWorked?: DecimalNullableFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    overtime?: DecimalNullableFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"Attendance"> | string | null
    createdAt?: DateTimeFilter<"Attendance"> | Date | string
    updatedAt?: DateTimeFilter<"Attendance"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }, "id" | "employeeId_date">

  export type AttendanceOrderByWithAggregationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    date?: SortOrder
    clockIn?: SortOrderInput | SortOrder
    clockOut?: SortOrderInput | SortOrder
    status?: SortOrder
    hoursWorked?: SortOrderInput | SortOrder
    overtime?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AttendanceCountOrderByAggregateInput
    _avg?: AttendanceAvgOrderByAggregateInput
    _max?: AttendanceMaxOrderByAggregateInput
    _min?: AttendanceMinOrderByAggregateInput
    _sum?: AttendanceSumOrderByAggregateInput
  }

  export type AttendanceScalarWhereWithAggregatesInput = {
    AND?: AttendanceScalarWhereWithAggregatesInput | AttendanceScalarWhereWithAggregatesInput[]
    OR?: AttendanceScalarWhereWithAggregatesInput[]
    NOT?: AttendanceScalarWhereWithAggregatesInput | AttendanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Attendance"> | string
    employeeId?: StringWithAggregatesFilter<"Attendance"> | string
    date?: DateTimeWithAggregatesFilter<"Attendance"> | Date | string
    clockIn?: DateTimeNullableWithAggregatesFilter<"Attendance"> | Date | string | null
    clockOut?: DateTimeNullableWithAggregatesFilter<"Attendance"> | Date | string | null
    status?: EnumAttendanceStatusWithAggregatesFilter<"Attendance"> | $Enums.AttendanceStatus
    hoursWorked?: DecimalNullableWithAggregatesFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    overtime?: DecimalNullableWithAggregatesFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableWithAggregatesFilter<"Attendance"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Attendance"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Attendance"> | Date | string
  }

  export type ShiftWhereInput = {
    AND?: ShiftWhereInput | ShiftWhereInput[]
    OR?: ShiftWhereInput[]
    NOT?: ShiftWhereInput | ShiftWhereInput[]
    id?: StringFilter<"Shift"> | string
    name?: StringFilter<"Shift"> | string
    code?: StringFilter<"Shift"> | string
    startTime?: StringFilter<"Shift"> | string
    endTime?: StringFilter<"Shift"> | string
    breakMins?: IntFilter<"Shift"> | number
    status?: StringFilter<"Shift"> | string
    createdAt?: DateTimeFilter<"Shift"> | Date | string
    updatedAt?: DateTimeFilter<"Shift"> | Date | string
    assignments?: ShiftAssignmentListRelationFilter
  }

  export type ShiftOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakMins?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignments?: ShiftAssignmentOrderByRelationAggregateInput
  }

  export type ShiftWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: ShiftWhereInput | ShiftWhereInput[]
    OR?: ShiftWhereInput[]
    NOT?: ShiftWhereInput | ShiftWhereInput[]
    name?: StringFilter<"Shift"> | string
    startTime?: StringFilter<"Shift"> | string
    endTime?: StringFilter<"Shift"> | string
    breakMins?: IntFilter<"Shift"> | number
    status?: StringFilter<"Shift"> | string
    createdAt?: DateTimeFilter<"Shift"> | Date | string
    updatedAt?: DateTimeFilter<"Shift"> | Date | string
    assignments?: ShiftAssignmentListRelationFilter
  }, "id" | "code">

  export type ShiftOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakMins?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ShiftCountOrderByAggregateInput
    _avg?: ShiftAvgOrderByAggregateInput
    _max?: ShiftMaxOrderByAggregateInput
    _min?: ShiftMinOrderByAggregateInput
    _sum?: ShiftSumOrderByAggregateInput
  }

  export type ShiftScalarWhereWithAggregatesInput = {
    AND?: ShiftScalarWhereWithAggregatesInput | ShiftScalarWhereWithAggregatesInput[]
    OR?: ShiftScalarWhereWithAggregatesInput[]
    NOT?: ShiftScalarWhereWithAggregatesInput | ShiftScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Shift"> | string
    name?: StringWithAggregatesFilter<"Shift"> | string
    code?: StringWithAggregatesFilter<"Shift"> | string
    startTime?: StringWithAggregatesFilter<"Shift"> | string
    endTime?: StringWithAggregatesFilter<"Shift"> | string
    breakMins?: IntWithAggregatesFilter<"Shift"> | number
    status?: StringWithAggregatesFilter<"Shift"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Shift"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Shift"> | Date | string
  }

  export type ShiftAssignmentWhereInput = {
    AND?: ShiftAssignmentWhereInput | ShiftAssignmentWhereInput[]
    OR?: ShiftAssignmentWhereInput[]
    NOT?: ShiftAssignmentWhereInput | ShiftAssignmentWhereInput[]
    id?: StringFilter<"ShiftAssignment"> | string
    employeeId?: StringFilter<"ShiftAssignment"> | string
    shiftId?: StringFilter<"ShiftAssignment"> | string
    date?: DateTimeFilter<"ShiftAssignment"> | Date | string
    createdAt?: DateTimeFilter<"ShiftAssignment"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
    shift?: XOR<ShiftRelationFilter, ShiftWhereInput>
  }

  export type ShiftAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    shiftId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    employee?: EmployeeOrderByWithRelationInput
    shift?: ShiftOrderByWithRelationInput
  }

  export type ShiftAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    employeeId_date?: ShiftAssignmentEmployeeIdDateCompoundUniqueInput
    AND?: ShiftAssignmentWhereInput | ShiftAssignmentWhereInput[]
    OR?: ShiftAssignmentWhereInput[]
    NOT?: ShiftAssignmentWhereInput | ShiftAssignmentWhereInput[]
    employeeId?: StringFilter<"ShiftAssignment"> | string
    shiftId?: StringFilter<"ShiftAssignment"> | string
    date?: DateTimeFilter<"ShiftAssignment"> | Date | string
    createdAt?: DateTimeFilter<"ShiftAssignment"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
    shift?: XOR<ShiftRelationFilter, ShiftWhereInput>
  }, "id" | "employeeId_date">

  export type ShiftAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    shiftId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
    _count?: ShiftAssignmentCountOrderByAggregateInput
    _max?: ShiftAssignmentMaxOrderByAggregateInput
    _min?: ShiftAssignmentMinOrderByAggregateInput
  }

  export type ShiftAssignmentScalarWhereWithAggregatesInput = {
    AND?: ShiftAssignmentScalarWhereWithAggregatesInput | ShiftAssignmentScalarWhereWithAggregatesInput[]
    OR?: ShiftAssignmentScalarWhereWithAggregatesInput[]
    NOT?: ShiftAssignmentScalarWhereWithAggregatesInput | ShiftAssignmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShiftAssignment"> | string
    employeeId?: StringWithAggregatesFilter<"ShiftAssignment"> | string
    shiftId?: StringWithAggregatesFilter<"ShiftAssignment"> | string
    date?: DateTimeWithAggregatesFilter<"ShiftAssignment"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"ShiftAssignment"> | Date | string
  }

  export type LeaveRequestWhereInput = {
    AND?: LeaveRequestWhereInput | LeaveRequestWhereInput[]
    OR?: LeaveRequestWhereInput[]
    NOT?: LeaveRequestWhereInput | LeaveRequestWhereInput[]
    id?: StringFilter<"LeaveRequest"> | string
    employeeId?: StringFilter<"LeaveRequest"> | string
    leaveType?: EnumLeaveTypeFilter<"LeaveRequest"> | $Enums.LeaveType
    startDate?: DateTimeFilter<"LeaveRequest"> | Date | string
    endDate?: DateTimeFilter<"LeaveRequest"> | Date | string
    days?: IntFilter<"LeaveRequest"> | number
    reason?: StringNullableFilter<"LeaveRequest"> | string | null
    status?: EnumLeaveStatusFilter<"LeaveRequest"> | $Enums.LeaveStatus
    approvedBy?: StringNullableFilter<"LeaveRequest"> | string | null
    approvedAt?: DateTimeNullableFilter<"LeaveRequest"> | Date | string | null
    rejectionReason?: StringNullableFilter<"LeaveRequest"> | string | null
    createdAt?: DateTimeFilter<"LeaveRequest"> | Date | string
    updatedAt?: DateTimeFilter<"LeaveRequest"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }

  export type LeaveRequestOrderByWithRelationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    leaveType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    days?: SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    employee?: EmployeeOrderByWithRelationInput
  }

  export type LeaveRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LeaveRequestWhereInput | LeaveRequestWhereInput[]
    OR?: LeaveRequestWhereInput[]
    NOT?: LeaveRequestWhereInput | LeaveRequestWhereInput[]
    employeeId?: StringFilter<"LeaveRequest"> | string
    leaveType?: EnumLeaveTypeFilter<"LeaveRequest"> | $Enums.LeaveType
    startDate?: DateTimeFilter<"LeaveRequest"> | Date | string
    endDate?: DateTimeFilter<"LeaveRequest"> | Date | string
    days?: IntFilter<"LeaveRequest"> | number
    reason?: StringNullableFilter<"LeaveRequest"> | string | null
    status?: EnumLeaveStatusFilter<"LeaveRequest"> | $Enums.LeaveStatus
    approvedBy?: StringNullableFilter<"LeaveRequest"> | string | null
    approvedAt?: DateTimeNullableFilter<"LeaveRequest"> | Date | string | null
    rejectionReason?: StringNullableFilter<"LeaveRequest"> | string | null
    createdAt?: DateTimeFilter<"LeaveRequest"> | Date | string
    updatedAt?: DateTimeFilter<"LeaveRequest"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }, "id">

  export type LeaveRequestOrderByWithAggregationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    leaveType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    days?: SortOrder
    reason?: SortOrderInput | SortOrder
    status?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeaveRequestCountOrderByAggregateInput
    _avg?: LeaveRequestAvgOrderByAggregateInput
    _max?: LeaveRequestMaxOrderByAggregateInput
    _min?: LeaveRequestMinOrderByAggregateInput
    _sum?: LeaveRequestSumOrderByAggregateInput
  }

  export type LeaveRequestScalarWhereWithAggregatesInput = {
    AND?: LeaveRequestScalarWhereWithAggregatesInput | LeaveRequestScalarWhereWithAggregatesInput[]
    OR?: LeaveRequestScalarWhereWithAggregatesInput[]
    NOT?: LeaveRequestScalarWhereWithAggregatesInput | LeaveRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LeaveRequest"> | string
    employeeId?: StringWithAggregatesFilter<"LeaveRequest"> | string
    leaveType?: EnumLeaveTypeWithAggregatesFilter<"LeaveRequest"> | $Enums.LeaveType
    startDate?: DateTimeWithAggregatesFilter<"LeaveRequest"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"LeaveRequest"> | Date | string
    days?: IntWithAggregatesFilter<"LeaveRequest"> | number
    reason?: StringNullableWithAggregatesFilter<"LeaveRequest"> | string | null
    status?: EnumLeaveStatusWithAggregatesFilter<"LeaveRequest"> | $Enums.LeaveStatus
    approvedBy?: StringNullableWithAggregatesFilter<"LeaveRequest"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"LeaveRequest"> | Date | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"LeaveRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LeaveRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LeaveRequest"> | Date | string
  }

  export type PayrollWhereInput = {
    AND?: PayrollWhereInput | PayrollWhereInput[]
    OR?: PayrollWhereInput[]
    NOT?: PayrollWhereInput | PayrollWhereInput[]
    id?: StringFilter<"Payroll"> | string
    employeeId?: StringFilter<"Payroll"> | string
    payPeriod?: StringFilter<"Payroll"> | string
    baseSalary?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFilter<"Payroll"> | $Enums.PayrollStatus
    paidAt?: DateTimeNullableFilter<"Payroll"> | Date | string | null
    notes?: StringNullableFilter<"Payroll"> | string | null
    createdAt?: DateTimeFilter<"Payroll"> | Date | string
    updatedAt?: DateTimeFilter<"Payroll"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }

  export type PayrollOrderByWithRelationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    payPeriod?: SortOrder
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
    status?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    employee?: EmployeeOrderByWithRelationInput
  }

  export type PayrollWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    employeeId_payPeriod?: PayrollEmployeeIdPayPeriodCompoundUniqueInput
    AND?: PayrollWhereInput | PayrollWhereInput[]
    OR?: PayrollWhereInput[]
    NOT?: PayrollWhereInput | PayrollWhereInput[]
    employeeId?: StringFilter<"Payroll"> | string
    payPeriod?: StringFilter<"Payroll"> | string
    baseSalary?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFilter<"Payroll"> | $Enums.PayrollStatus
    paidAt?: DateTimeNullableFilter<"Payroll"> | Date | string | null
    notes?: StringNullableFilter<"Payroll"> | string | null
    createdAt?: DateTimeFilter<"Payroll"> | Date | string
    updatedAt?: DateTimeFilter<"Payroll"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }, "id" | "employeeId_payPeriod">

  export type PayrollOrderByWithAggregationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    payPeriod?: SortOrder
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
    status?: SortOrder
    paidAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayrollCountOrderByAggregateInput
    _avg?: PayrollAvgOrderByAggregateInput
    _max?: PayrollMaxOrderByAggregateInput
    _min?: PayrollMinOrderByAggregateInput
    _sum?: PayrollSumOrderByAggregateInput
  }

  export type PayrollScalarWhereWithAggregatesInput = {
    AND?: PayrollScalarWhereWithAggregatesInput | PayrollScalarWhereWithAggregatesInput[]
    OR?: PayrollScalarWhereWithAggregatesInput[]
    NOT?: PayrollScalarWhereWithAggregatesInput | PayrollScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payroll"> | string
    employeeId?: StringWithAggregatesFilter<"Payroll"> | string
    payPeriod?: StringWithAggregatesFilter<"Payroll"> | string
    baseSalary?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    allowances?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    deductions?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    bonus?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    netPay?: DecimalWithAggregatesFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusWithAggregatesFilter<"Payroll"> | $Enums.PayrollStatus
    paidAt?: DateTimeNullableWithAggregatesFilter<"Payroll"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"Payroll"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Payroll"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payroll"> | Date | string
  }

  export type PerformanceReviewWhereInput = {
    AND?: PerformanceReviewWhereInput | PerformanceReviewWhereInput[]
    OR?: PerformanceReviewWhereInput[]
    NOT?: PerformanceReviewWhereInput | PerformanceReviewWhereInput[]
    id?: StringFilter<"PerformanceReview"> | string
    employeeId?: StringFilter<"PerformanceReview"> | string
    reviewerId?: StringFilter<"PerformanceReview"> | string
    period?: StringFilter<"PerformanceReview"> | string
    rating?: EnumPerformanceRatingFilter<"PerformanceReview"> | $Enums.PerformanceRating
    goals?: JsonNullableFilter<"PerformanceReview">
    strengths?: StringNullableFilter<"PerformanceReview"> | string | null
    improvements?: StringNullableFilter<"PerformanceReview"> | string | null
    comments?: StringNullableFilter<"PerformanceReview"> | string | null
    nextReview?: DateTimeNullableFilter<"PerformanceReview"> | Date | string | null
    createdAt?: DateTimeFilter<"PerformanceReview"> | Date | string
    updatedAt?: DateTimeFilter<"PerformanceReview"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }

  export type PerformanceReviewOrderByWithRelationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    reviewerId?: SortOrder
    period?: SortOrder
    rating?: SortOrder
    goals?: SortOrderInput | SortOrder
    strengths?: SortOrderInput | SortOrder
    improvements?: SortOrderInput | SortOrder
    comments?: SortOrderInput | SortOrder
    nextReview?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    employee?: EmployeeOrderByWithRelationInput
  }

  export type PerformanceReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PerformanceReviewWhereInput | PerformanceReviewWhereInput[]
    OR?: PerformanceReviewWhereInput[]
    NOT?: PerformanceReviewWhereInput | PerformanceReviewWhereInput[]
    employeeId?: StringFilter<"PerformanceReview"> | string
    reviewerId?: StringFilter<"PerformanceReview"> | string
    period?: StringFilter<"PerformanceReview"> | string
    rating?: EnumPerformanceRatingFilter<"PerformanceReview"> | $Enums.PerformanceRating
    goals?: JsonNullableFilter<"PerformanceReview">
    strengths?: StringNullableFilter<"PerformanceReview"> | string | null
    improvements?: StringNullableFilter<"PerformanceReview"> | string | null
    comments?: StringNullableFilter<"PerformanceReview"> | string | null
    nextReview?: DateTimeNullableFilter<"PerformanceReview"> | Date | string | null
    createdAt?: DateTimeFilter<"PerformanceReview"> | Date | string
    updatedAt?: DateTimeFilter<"PerformanceReview"> | Date | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
  }, "id">

  export type PerformanceReviewOrderByWithAggregationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    reviewerId?: SortOrder
    period?: SortOrder
    rating?: SortOrder
    goals?: SortOrderInput | SortOrder
    strengths?: SortOrderInput | SortOrder
    improvements?: SortOrderInput | SortOrder
    comments?: SortOrderInput | SortOrder
    nextReview?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PerformanceReviewCountOrderByAggregateInput
    _max?: PerformanceReviewMaxOrderByAggregateInput
    _min?: PerformanceReviewMinOrderByAggregateInput
  }

  export type PerformanceReviewScalarWhereWithAggregatesInput = {
    AND?: PerformanceReviewScalarWhereWithAggregatesInput | PerformanceReviewScalarWhereWithAggregatesInput[]
    OR?: PerformanceReviewScalarWhereWithAggregatesInput[]
    NOT?: PerformanceReviewScalarWhereWithAggregatesInput | PerformanceReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PerformanceReview"> | string
    employeeId?: StringWithAggregatesFilter<"PerformanceReview"> | string
    reviewerId?: StringWithAggregatesFilter<"PerformanceReview"> | string
    period?: StringWithAggregatesFilter<"PerformanceReview"> | string
    rating?: EnumPerformanceRatingWithAggregatesFilter<"PerformanceReview"> | $Enums.PerformanceRating
    goals?: JsonNullableWithAggregatesFilter<"PerformanceReview">
    strengths?: StringNullableWithAggregatesFilter<"PerformanceReview"> | string | null
    improvements?: StringNullableWithAggregatesFilter<"PerformanceReview"> | string | null
    comments?: StringNullableWithAggregatesFilter<"PerformanceReview"> | string | null
    nextReview?: DateTimeNullableWithAggregatesFilter<"PerformanceReview"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PerformanceReview"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PerformanceReview"> | Date | string
  }

  export type TrainingWhereInput = {
    AND?: TrainingWhereInput | TrainingWhereInput[]
    OR?: TrainingWhereInput[]
    NOT?: TrainingWhereInput | TrainingWhereInput[]
    id?: StringFilter<"Training"> | string
    title?: StringFilter<"Training"> | string
    code?: StringFilter<"Training"> | string
    description?: StringNullableFilter<"Training"> | string | null
    duration?: IntNullableFilter<"Training"> | number | null
    provider?: StringNullableFilter<"Training"> | string | null
    cost?: DecimalNullableFilter<"Training"> | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: IntNullableFilter<"Training"> | number | null
    startDate?: DateTimeNullableFilter<"Training"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Training"> | Date | string | null
    status?: EnumTrainingStatusFilter<"Training"> | $Enums.TrainingStatus
    createdAt?: DateTimeFilter<"Training"> | Date | string
    updatedAt?: DateTimeFilter<"Training"> | Date | string
    enrollments?: TrainingEnrollmentListRelationFilter
  }

  export type TrainingOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    provider?: SortOrderInput | SortOrder
    cost?: SortOrderInput | SortOrder
    maxEnroll?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enrollments?: TrainingEnrollmentOrderByRelationAggregateInput
  }

  export type TrainingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: TrainingWhereInput | TrainingWhereInput[]
    OR?: TrainingWhereInput[]
    NOT?: TrainingWhereInput | TrainingWhereInput[]
    title?: StringFilter<"Training"> | string
    description?: StringNullableFilter<"Training"> | string | null
    duration?: IntNullableFilter<"Training"> | number | null
    provider?: StringNullableFilter<"Training"> | string | null
    cost?: DecimalNullableFilter<"Training"> | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: IntNullableFilter<"Training"> | number | null
    startDate?: DateTimeNullableFilter<"Training"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Training"> | Date | string | null
    status?: EnumTrainingStatusFilter<"Training"> | $Enums.TrainingStatus
    createdAt?: DateTimeFilter<"Training"> | Date | string
    updatedAt?: DateTimeFilter<"Training"> | Date | string
    enrollments?: TrainingEnrollmentListRelationFilter
  }, "id" | "code">

  export type TrainingOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    provider?: SortOrderInput | SortOrder
    cost?: SortOrderInput | SortOrder
    maxEnroll?: SortOrderInput | SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrainingCountOrderByAggregateInput
    _avg?: TrainingAvgOrderByAggregateInput
    _max?: TrainingMaxOrderByAggregateInput
    _min?: TrainingMinOrderByAggregateInput
    _sum?: TrainingSumOrderByAggregateInput
  }

  export type TrainingScalarWhereWithAggregatesInput = {
    AND?: TrainingScalarWhereWithAggregatesInput | TrainingScalarWhereWithAggregatesInput[]
    OR?: TrainingScalarWhereWithAggregatesInput[]
    NOT?: TrainingScalarWhereWithAggregatesInput | TrainingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Training"> | string
    title?: StringWithAggregatesFilter<"Training"> | string
    code?: StringWithAggregatesFilter<"Training"> | string
    description?: StringNullableWithAggregatesFilter<"Training"> | string | null
    duration?: IntNullableWithAggregatesFilter<"Training"> | number | null
    provider?: StringNullableWithAggregatesFilter<"Training"> | string | null
    cost?: DecimalNullableWithAggregatesFilter<"Training"> | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: IntNullableWithAggregatesFilter<"Training"> | number | null
    startDate?: DateTimeNullableWithAggregatesFilter<"Training"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Training"> | Date | string | null
    status?: EnumTrainingStatusWithAggregatesFilter<"Training"> | $Enums.TrainingStatus
    createdAt?: DateTimeWithAggregatesFilter<"Training"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Training"> | Date | string
  }

  export type TrainingEnrollmentWhereInput = {
    AND?: TrainingEnrollmentWhereInput | TrainingEnrollmentWhereInput[]
    OR?: TrainingEnrollmentWhereInput[]
    NOT?: TrainingEnrollmentWhereInput | TrainingEnrollmentWhereInput[]
    id?: StringFilter<"TrainingEnrollment"> | string
    employeeId?: StringFilter<"TrainingEnrollment"> | string
    trainingId?: StringFilter<"TrainingEnrollment"> | string
    enrolledAt?: DateTimeFilter<"TrainingEnrollment"> | Date | string
    completedAt?: DateTimeNullableFilter<"TrainingEnrollment"> | Date | string | null
    score?: IntNullableFilter<"TrainingEnrollment"> | number | null
    certificate?: StringNullableFilter<"TrainingEnrollment"> | string | null
    status?: StringFilter<"TrainingEnrollment"> | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
    training?: XOR<TrainingRelationFilter, TrainingWhereInput>
  }

  export type TrainingEnrollmentOrderByWithRelationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    trainingId?: SortOrder
    enrolledAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    certificate?: SortOrderInput | SortOrder
    status?: SortOrder
    employee?: EmployeeOrderByWithRelationInput
    training?: TrainingOrderByWithRelationInput
  }

  export type TrainingEnrollmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    employeeId_trainingId?: TrainingEnrollmentEmployeeIdTrainingIdCompoundUniqueInput
    AND?: TrainingEnrollmentWhereInput | TrainingEnrollmentWhereInput[]
    OR?: TrainingEnrollmentWhereInput[]
    NOT?: TrainingEnrollmentWhereInput | TrainingEnrollmentWhereInput[]
    employeeId?: StringFilter<"TrainingEnrollment"> | string
    trainingId?: StringFilter<"TrainingEnrollment"> | string
    enrolledAt?: DateTimeFilter<"TrainingEnrollment"> | Date | string
    completedAt?: DateTimeNullableFilter<"TrainingEnrollment"> | Date | string | null
    score?: IntNullableFilter<"TrainingEnrollment"> | number | null
    certificate?: StringNullableFilter<"TrainingEnrollment"> | string | null
    status?: StringFilter<"TrainingEnrollment"> | string
    employee?: XOR<EmployeeRelationFilter, EmployeeWhereInput>
    training?: XOR<TrainingRelationFilter, TrainingWhereInput>
  }, "id" | "employeeId_trainingId">

  export type TrainingEnrollmentOrderByWithAggregationInput = {
    id?: SortOrder
    employeeId?: SortOrder
    trainingId?: SortOrder
    enrolledAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    certificate?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: TrainingEnrollmentCountOrderByAggregateInput
    _avg?: TrainingEnrollmentAvgOrderByAggregateInput
    _max?: TrainingEnrollmentMaxOrderByAggregateInput
    _min?: TrainingEnrollmentMinOrderByAggregateInput
    _sum?: TrainingEnrollmentSumOrderByAggregateInput
  }

  export type TrainingEnrollmentScalarWhereWithAggregatesInput = {
    AND?: TrainingEnrollmentScalarWhereWithAggregatesInput | TrainingEnrollmentScalarWhereWithAggregatesInput[]
    OR?: TrainingEnrollmentScalarWhereWithAggregatesInput[]
    NOT?: TrainingEnrollmentScalarWhereWithAggregatesInput | TrainingEnrollmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrainingEnrollment"> | string
    employeeId?: StringWithAggregatesFilter<"TrainingEnrollment"> | string
    trainingId?: StringWithAggregatesFilter<"TrainingEnrollment"> | string
    enrolledAt?: DateTimeWithAggregatesFilter<"TrainingEnrollment"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"TrainingEnrollment"> | Date | string | null
    score?: IntNullableWithAggregatesFilter<"TrainingEnrollment"> | number | null
    certificate?: StringNullableWithAggregatesFilter<"TrainingEnrollment"> | string | null
    status?: StringWithAggregatesFilter<"TrainingEnrollment"> | string
  }

  export type HrUserCreateInput = {
    id?: string
    tollgateUserId: string
    email: string
    name: string
    role?: string
    status?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HrUserUncheckedCreateInput = {
    id?: string
    tollgateUserId: string
    email: string
    name: string
    role?: string
    status?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HrUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HrUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HrUserCreateManyInput = {
    id?: string
    tollgateUserId: string
    email: string
    name: string
    role?: string
    status?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HrUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HrUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeCreateNestedManyWithoutDepartmentInput
    positions?: PositionCreateNestedManyWithoutDepartmentInput
    parent?: DepartmentCreateNestedOneWithoutChildrenInput
    children?: DepartmentCreateNestedManyWithoutParentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    parentId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeUncheckedCreateNestedManyWithoutDepartmentInput
    positions?: PositionUncheckedCreateNestedManyWithoutDepartmentInput
    children?: DepartmentUncheckedCreateNestedManyWithoutParentInput
  }

  export type DepartmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUpdateManyWithoutDepartmentNestedInput
    positions?: PositionUpdateManyWithoutDepartmentNestedInput
    parent?: DepartmentUpdateOneWithoutChildrenNestedInput
    children?: DepartmentUpdateManyWithoutParentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUncheckedUpdateManyWithoutDepartmentNestedInput
    positions?: PositionUncheckedUpdateManyWithoutDepartmentNestedInput
    children?: DepartmentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    parentId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionCreateInput = {
    id?: string
    title: string
    code: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeCreateNestedManyWithoutPositionInput
    department: DepartmentCreateNestedOneWithoutPositionsInput
  }

  export type PositionUncheckedCreateInput = {
    id?: string
    title: string
    code: string
    departmentId: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeUncheckedCreateNestedManyWithoutPositionInput
  }

  export type PositionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUpdateManyWithoutPositionNestedInput
    department?: DepartmentUpdateOneRequiredWithoutPositionsNestedInput
  }

  export type PositionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    departmentId?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type PositionCreateManyInput = {
    id?: string
    title: string
    code: string
    departmentId: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    departmentId?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeCreateManyInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmployeeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceCreateInput = {
    id?: string
    date: Date | string
    clockIn?: Date | string | null
    clockOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    hoursWorked?: Decimal | DecimalJsLike | number | string | null
    overtime?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    employee: EmployeeCreateNestedOneWithoutAttendancesInput
  }

  export type AttendanceUncheckedCreateInput = {
    id?: string
    employeeId: string
    date: Date | string
    clockIn?: Date | string | null
    clockOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    hoursWorked?: Decimal | DecimalJsLike | number | string | null
    overtime?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employee?: EmployeeUpdateOneRequiredWithoutAttendancesNestedInput
  }

  export type AttendanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceCreateManyInput = {
    id?: string
    employeeId: string
    date: Date | string
    clockIn?: Date | string | null
    clockOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    hoursWorked?: Decimal | DecimalJsLike | number | string | null
    overtime?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftCreateInput = {
    id?: string
    name: string
    code: string
    startTime: string
    endTime: string
    breakMins?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: ShiftAssignmentCreateNestedManyWithoutShiftInput
  }

  export type ShiftUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    startTime: string
    endTime: string
    breakMins?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutShiftInput
  }

  export type ShiftUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: ShiftAssignmentUpdateManyWithoutShiftNestedInput
  }

  export type ShiftUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignments?: ShiftAssignmentUncheckedUpdateManyWithoutShiftNestedInput
  }

  export type ShiftCreateManyInput = {
    id?: string
    name: string
    code: string
    startTime: string
    endTime: string
    breakMins?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShiftUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftAssignmentCreateInput = {
    id?: string
    date: Date | string
    createdAt?: Date | string
    employee: EmployeeCreateNestedOneWithoutShiftAssignmentsInput
    shift: ShiftCreateNestedOneWithoutAssignmentsInput
  }

  export type ShiftAssignmentUncheckedCreateInput = {
    id?: string
    employeeId: string
    shiftId: string
    date: Date | string
    createdAt?: Date | string
  }

  export type ShiftAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employee?: EmployeeUpdateOneRequiredWithoutShiftAssignmentsNestedInput
    shift?: ShiftUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type ShiftAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    shiftId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftAssignmentCreateManyInput = {
    id?: string
    employeeId: string
    shiftId: string
    date: Date | string
    createdAt?: Date | string
  }

  export type ShiftAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    shiftId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaveRequestCreateInput = {
    id?: string
    leaveType: $Enums.LeaveType
    startDate: Date | string
    endDate: Date | string
    days: number
    reason?: string | null
    status?: $Enums.LeaveStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    employee: EmployeeCreateNestedOneWithoutLeaveRequestsInput
  }

  export type LeaveRequestUncheckedCreateInput = {
    id?: string
    employeeId: string
    leaveType: $Enums.LeaveType
    startDate: Date | string
    endDate: Date | string
    days: number
    reason?: string | null
    status?: $Enums.LeaveStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaveRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employee?: EmployeeUpdateOneRequiredWithoutLeaveRequestsNestedInput
  }

  export type LeaveRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaveRequestCreateManyInput = {
    id?: string
    employeeId: string
    leaveType: $Enums.LeaveType
    startDate: Date | string
    endDate: Date | string
    days: number
    reason?: string | null
    status?: $Enums.LeaveStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaveRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaveRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollCreateInput = {
    id?: string
    payPeriod: string
    baseSalary: Decimal | DecimalJsLike | number | string
    allowances?: Decimal | DecimalJsLike | number | string
    deductions?: Decimal | DecimalJsLike | number | string
    overtimePay?: Decimal | DecimalJsLike | number | string
    bonus?: Decimal | DecimalJsLike | number | string
    tax?: Decimal | DecimalJsLike | number | string
    netPay: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paidAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    employee: EmployeeCreateNestedOneWithoutPayrollsInput
  }

  export type PayrollUncheckedCreateInput = {
    id?: string
    employeeId: string
    payPeriod: string
    baseSalary: Decimal | DecimalJsLike | number | string
    allowances?: Decimal | DecimalJsLike | number | string
    deductions?: Decimal | DecimalJsLike | number | string
    overtimePay?: Decimal | DecimalJsLike | number | string
    bonus?: Decimal | DecimalJsLike | number | string
    tax?: Decimal | DecimalJsLike | number | string
    netPay: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paidAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employee?: EmployeeUpdateOneRequiredWithoutPayrollsNestedInput
  }

  export type PayrollUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollCreateManyInput = {
    id?: string
    employeeId: string
    payPeriod: string
    baseSalary: Decimal | DecimalJsLike | number | string
    allowances?: Decimal | DecimalJsLike | number | string
    deductions?: Decimal | DecimalJsLike | number | string
    overtimePay?: Decimal | DecimalJsLike | number | string
    bonus?: Decimal | DecimalJsLike | number | string
    tax?: Decimal | DecimalJsLike | number | string
    netPay: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paidAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceReviewCreateInput = {
    id?: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: string | null
    improvements?: string | null
    comments?: string | null
    nextReview?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    employee: EmployeeCreateNestedOneWithoutPerformancesInput
  }

  export type PerformanceReviewUncheckedCreateInput = {
    id?: string
    employeeId: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: string | null
    improvements?: string | null
    comments?: string | null
    nextReview?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerformanceReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employee?: EmployeeUpdateOneRequiredWithoutPerformancesNestedInput
  }

  export type PerformanceReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceReviewCreateManyInput = {
    id?: string
    employeeId: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: string | null
    improvements?: string | null
    comments?: string | null
    nextReview?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerformanceReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainingCreateInput = {
    id?: string
    title: string
    code: string
    description?: string | null
    duration?: number | null
    provider?: string | null
    cost?: Decimal | DecimalJsLike | number | string | null
    maxEnroll?: number | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    status?: $Enums.TrainingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: TrainingEnrollmentCreateNestedManyWithoutTrainingInput
  }

  export type TrainingUncheckedCreateInput = {
    id?: string
    title: string
    code: string
    description?: string | null
    duration?: number | null
    provider?: string | null
    cost?: Decimal | DecimalJsLike | number | string | null
    maxEnroll?: number | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    status?: $Enums.TrainingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    enrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutTrainingInput
  }

  export type TrainingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTrainingStatusFieldUpdateOperationsInput | $Enums.TrainingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: TrainingEnrollmentUpdateManyWithoutTrainingNestedInput
  }

  export type TrainingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTrainingStatusFieldUpdateOperationsInput | $Enums.TrainingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutTrainingNestedInput
  }

  export type TrainingCreateManyInput = {
    id?: string
    title: string
    code: string
    description?: string | null
    duration?: number | null
    provider?: string | null
    cost?: Decimal | DecimalJsLike | number | string | null
    maxEnroll?: number | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    status?: $Enums.TrainingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrainingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTrainingStatusFieldUpdateOperationsInput | $Enums.TrainingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTrainingStatusFieldUpdateOperationsInput | $Enums.TrainingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainingEnrollmentCreateInput = {
    id?: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
    employee: EmployeeCreateNestedOneWithoutTrainingEnrollmentsInput
    training: TrainingCreateNestedOneWithoutEnrollmentsInput
  }

  export type TrainingEnrollmentUncheckedCreateInput = {
    id?: string
    employeeId: string
    trainingId: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
  }

  export type TrainingEnrollmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    employee?: EmployeeUpdateOneRequiredWithoutTrainingEnrollmentsNestedInput
    training?: TrainingUpdateOneRequiredWithoutEnrollmentsNestedInput
  }

  export type TrainingEnrollmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    trainingId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type TrainingEnrollmentCreateManyInput = {
    id?: string
    employeeId: string
    trainingId: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
  }

  export type TrainingEnrollmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type TrainingEnrollmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    trainingId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type HrUserCountOrderByAggregateInput = {
    id?: SortOrder
    tollgateUserId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HrUserMaxOrderByAggregateInput = {
    id?: SortOrder
    tollgateUserId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HrUserMinOrderByAggregateInput = {
    id?: SortOrder
    tollgateUserId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumDepartmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DepartmentType | EnumDepartmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDepartmentTypeFilter<$PrismaModel> | $Enums.DepartmentType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EmployeeListRelationFilter = {
    every?: EmployeeWhereInput
    some?: EmployeeWhereInput
    none?: EmployeeWhereInput
  }

  export type PositionListRelationFilter = {
    every?: PositionWhereInput
    some?: PositionWhereInput
    none?: PositionWhereInput
  }

  export type DepartmentNullableRelationFilter = {
    is?: DepartmentWhereInput | null
    isNot?: DepartmentWhereInput | null
  }

  export type DepartmentListRelationFilter = {
    every?: DepartmentWhereInput
    some?: DepartmentWhereInput
    none?: DepartmentWhereInput
  }

  export type EmployeeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PositionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    type?: SortOrder
    description?: SortOrder
    managerId?: SortOrder
    parentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    type?: SortOrder
    description?: SortOrder
    managerId?: SortOrder
    parentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    type?: SortOrder
    description?: SortOrder
    managerId?: SortOrder
    parentId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumDepartmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DepartmentType | EnumDepartmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDepartmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DepartmentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDepartmentTypeFilter<$PrismaModel>
    _max?: NestedEnumDepartmentTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type DepartmentRelationFilter = {
    is?: DepartmentWhereInput
    isNot?: DepartmentWhereInput
  }

  export type PositionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    departmentId?: SortOrder
    level?: SortOrder
    minSalary?: SortOrder
    maxSalary?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PositionAvgOrderByAggregateInput = {
    level?: SortOrder
    minSalary?: SortOrder
    maxSalary?: SortOrder
  }

  export type PositionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    departmentId?: SortOrder
    level?: SortOrder
    minSalary?: SortOrder
    maxSalary?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PositionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    departmentId?: SortOrder
    level?: SortOrder
    minSalary?: SortOrder
    maxSalary?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PositionSumOrderByAggregateInput = {
    level?: SortOrder
    minSalary?: SortOrder
    maxSalary?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumEmployeeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEmployeeStatusFilter<$PrismaModel> | $Enums.EmployeeStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PositionRelationFilter = {
    is?: PositionWhereInput
    isNot?: PositionWhereInput
  }

  export type EmployeeNullableRelationFilter = {
    is?: EmployeeWhereInput | null
    isNot?: EmployeeWhereInput | null
  }

  export type AttendanceListRelationFilter = {
    every?: AttendanceWhereInput
    some?: AttendanceWhereInput
    none?: AttendanceWhereInput
  }

  export type ShiftAssignmentListRelationFilter = {
    every?: ShiftAssignmentWhereInput
    some?: ShiftAssignmentWhereInput
    none?: ShiftAssignmentWhereInput
  }

  export type LeaveRequestListRelationFilter = {
    every?: LeaveRequestWhereInput
    some?: LeaveRequestWhereInput
    none?: LeaveRequestWhereInput
  }

  export type PayrollListRelationFilter = {
    every?: PayrollWhereInput
    some?: PayrollWhereInput
    none?: PayrollWhereInput
  }

  export type PerformanceReviewListRelationFilter = {
    every?: PerformanceReviewWhereInput
    some?: PerformanceReviewWhereInput
    none?: PerformanceReviewWhereInput
  }

  export type TrainingEnrollmentListRelationFilter = {
    every?: TrainingEnrollmentWhereInput
    some?: TrainingEnrollmentWhereInput
    none?: TrainingEnrollmentWhereInput
  }

  export type AttendanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShiftAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeaveRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PayrollOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PerformanceReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrainingEnrollmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmployeeCountOrderByAggregateInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    tollgateUserId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    nrcNumber?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    emergencyContact?: SortOrder
    emergencyPhone?: SortOrder
    departmentId?: SortOrder
    positionId?: SortOrder
    managerId?: SortOrder
    hireDate?: SortOrder
    salary?: SortOrder
    status?: SortOrder
    terminationDate?: SortOrder
    profilePhoto?: SortOrder
    notes?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmployeeAvgOrderByAggregateInput = {
    salary?: SortOrder
  }

  export type EmployeeMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    tollgateUserId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    nrcNumber?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    emergencyContact?: SortOrder
    emergencyPhone?: SortOrder
    departmentId?: SortOrder
    positionId?: SortOrder
    managerId?: SortOrder
    hireDate?: SortOrder
    salary?: SortOrder
    status?: SortOrder
    terminationDate?: SortOrder
    profilePhoto?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmployeeMinOrderByAggregateInput = {
    id?: SortOrder
    employeeNumber?: SortOrder
    tollgateUserId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    nrcNumber?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    emergencyContact?: SortOrder
    emergencyPhone?: SortOrder
    departmentId?: SortOrder
    positionId?: SortOrder
    managerId?: SortOrder
    hireDate?: SortOrder
    salary?: SortOrder
    status?: SortOrder
    terminationDate?: SortOrder
    profilePhoto?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmployeeSumOrderByAggregateInput = {
    salary?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumEmployeeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEmployeeStatusWithAggregatesFilter<$PrismaModel> | $Enums.EmployeeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEmployeeStatusFilter<$PrismaModel>
    _max?: NestedEnumEmployeeStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumAttendanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusFilter<$PrismaModel> | $Enums.AttendanceStatus
  }

  export type EmployeeRelationFilter = {
    is?: EmployeeWhereInput
    isNot?: EmployeeWhereInput
  }

  export type AttendanceEmployeeIdDateCompoundUniqueInput = {
    employeeId: string
    date: Date | string
  }

  export type AttendanceCountOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    date?: SortOrder
    clockIn?: SortOrder
    clockOut?: SortOrder
    status?: SortOrder
    hoursWorked?: SortOrder
    overtime?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttendanceAvgOrderByAggregateInput = {
    hoursWorked?: SortOrder
    overtime?: SortOrder
  }

  export type AttendanceMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    date?: SortOrder
    clockIn?: SortOrder
    clockOut?: SortOrder
    status?: SortOrder
    hoursWorked?: SortOrder
    overtime?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttendanceMinOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    date?: SortOrder
    clockIn?: SortOrder
    clockOut?: SortOrder
    status?: SortOrder
    hoursWorked?: SortOrder
    overtime?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AttendanceSumOrderByAggregateInput = {
    hoursWorked?: SortOrder
    overtime?: SortOrder
  }

  export type EnumAttendanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.AttendanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttendanceStatusFilter<$PrismaModel>
    _max?: NestedEnumAttendanceStatusFilter<$PrismaModel>
  }

  export type ShiftCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakMins?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShiftAvgOrderByAggregateInput = {
    breakMins?: SortOrder
  }

  export type ShiftMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakMins?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShiftMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    breakMins?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShiftSumOrderByAggregateInput = {
    breakMins?: SortOrder
  }

  export type ShiftRelationFilter = {
    is?: ShiftWhereInput
    isNot?: ShiftWhereInput
  }

  export type ShiftAssignmentEmployeeIdDateCompoundUniqueInput = {
    employeeId: string
    date: Date | string
  }

  export type ShiftAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    shiftId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
  }

  export type ShiftAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    shiftId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
  }

  export type ShiftAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    shiftId?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumLeaveTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveType | EnumLeaveTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveTypeFilter<$PrismaModel> | $Enums.LeaveType
  }

  export type EnumLeaveStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveStatus | EnumLeaveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveStatusFilter<$PrismaModel> | $Enums.LeaveStatus
  }

  export type LeaveRequestCountOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    leaveType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    days?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaveRequestAvgOrderByAggregateInput = {
    days?: SortOrder
  }

  export type LeaveRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    leaveType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    days?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaveRequestMinOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    leaveType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    days?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaveRequestSumOrderByAggregateInput = {
    days?: SortOrder
  }

  export type EnumLeaveTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveType | EnumLeaveTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveTypeWithAggregatesFilter<$PrismaModel> | $Enums.LeaveType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeaveTypeFilter<$PrismaModel>
    _max?: NestedEnumLeaveTypeFilter<$PrismaModel>
  }

  export type EnumLeaveStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveStatus | EnumLeaveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeaveStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeaveStatusFilter<$PrismaModel>
    _max?: NestedEnumLeaveStatusFilter<$PrismaModel>
  }

  export type EnumPayrollStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusFilter<$PrismaModel> | $Enums.PayrollStatus
  }

  export type PayrollEmployeeIdPayPeriodCompoundUniqueInput = {
    employeeId: string
    payPeriod: string
  }

  export type PayrollCountOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    payPeriod?: SortOrder
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollAvgOrderByAggregateInput = {
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
  }

  export type PayrollMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    payPeriod?: SortOrder
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollMinOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    payPeriod?: SortOrder
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
    status?: SortOrder
    paidAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollSumOrderByAggregateInput = {
    baseSalary?: SortOrder
    allowances?: SortOrder
    deductions?: SortOrder
    overtimePay?: SortOrder
    bonus?: SortOrder
    tax?: SortOrder
    netPay?: SortOrder
  }

  export type EnumPayrollStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollStatusFilter<$PrismaModel>
  }

  export type EnumPerformanceRatingFilter<$PrismaModel = never> = {
    equals?: $Enums.PerformanceRating | EnumPerformanceRatingFieldRefInput<$PrismaModel>
    in?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumPerformanceRatingFilter<$PrismaModel> | $Enums.PerformanceRating
  }

  export type PerformanceReviewCountOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    reviewerId?: SortOrder
    period?: SortOrder
    rating?: SortOrder
    goals?: SortOrder
    strengths?: SortOrder
    improvements?: SortOrder
    comments?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerformanceReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    reviewerId?: SortOrder
    period?: SortOrder
    rating?: SortOrder
    strengths?: SortOrder
    improvements?: SortOrder
    comments?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerformanceReviewMinOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    reviewerId?: SortOrder
    period?: SortOrder
    rating?: SortOrder
    strengths?: SortOrder
    improvements?: SortOrder
    comments?: SortOrder
    nextReview?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumPerformanceRatingWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PerformanceRating | EnumPerformanceRatingFieldRefInput<$PrismaModel>
    in?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumPerformanceRatingWithAggregatesFilter<$PrismaModel> | $Enums.PerformanceRating
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPerformanceRatingFilter<$PrismaModel>
    _max?: NestedEnumPerformanceRatingFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumTrainingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingStatus | EnumTrainingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingStatusFilter<$PrismaModel> | $Enums.TrainingStatus
  }

  export type TrainingCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    provider?: SortOrder
    cost?: SortOrder
    maxEnroll?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrainingAvgOrderByAggregateInput = {
    duration?: SortOrder
    cost?: SortOrder
    maxEnroll?: SortOrder
  }

  export type TrainingMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    provider?: SortOrder
    cost?: SortOrder
    maxEnroll?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrainingMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    code?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    provider?: SortOrder
    cost?: SortOrder
    maxEnroll?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrainingSumOrderByAggregateInput = {
    duration?: SortOrder
    cost?: SortOrder
    maxEnroll?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumTrainingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingStatus | EnumTrainingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrainingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrainingStatusFilter<$PrismaModel>
    _max?: NestedEnumTrainingStatusFilter<$PrismaModel>
  }

  export type TrainingRelationFilter = {
    is?: TrainingWhereInput
    isNot?: TrainingWhereInput
  }

  export type TrainingEnrollmentEmployeeIdTrainingIdCompoundUniqueInput = {
    employeeId: string
    trainingId: string
  }

  export type TrainingEnrollmentCountOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    trainingId?: SortOrder
    enrolledAt?: SortOrder
    completedAt?: SortOrder
    score?: SortOrder
    certificate?: SortOrder
    status?: SortOrder
  }

  export type TrainingEnrollmentAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type TrainingEnrollmentMaxOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    trainingId?: SortOrder
    enrolledAt?: SortOrder
    completedAt?: SortOrder
    score?: SortOrder
    certificate?: SortOrder
    status?: SortOrder
  }

  export type TrainingEnrollmentMinOrderByAggregateInput = {
    id?: SortOrder
    employeeId?: SortOrder
    trainingId?: SortOrder
    enrolledAt?: SortOrder
    completedAt?: SortOrder
    score?: SortOrder
    certificate?: SortOrder
    status?: SortOrder
  }

  export type TrainingEnrollmentSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EmployeeCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<EmployeeCreateWithoutDepartmentInput, EmployeeUncheckedCreateWithoutDepartmentInput> | EmployeeCreateWithoutDepartmentInput[] | EmployeeUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutDepartmentInput | EmployeeCreateOrConnectWithoutDepartmentInput[]
    createMany?: EmployeeCreateManyDepartmentInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type PositionCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<PositionCreateWithoutDepartmentInput, PositionUncheckedCreateWithoutDepartmentInput> | PositionCreateWithoutDepartmentInput[] | PositionUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutDepartmentInput | PositionCreateOrConnectWithoutDepartmentInput[]
    createMany?: PositionCreateManyDepartmentInputEnvelope
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
  }

  export type DepartmentCreateNestedOneWithoutChildrenInput = {
    create?: XOR<DepartmentCreateWithoutChildrenInput, DepartmentUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutChildrenInput
    connect?: DepartmentWhereUniqueInput
  }

  export type DepartmentCreateNestedManyWithoutParentInput = {
    create?: XOR<DepartmentCreateWithoutParentInput, DepartmentUncheckedCreateWithoutParentInput> | DepartmentCreateWithoutParentInput[] | DepartmentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutParentInput | DepartmentCreateOrConnectWithoutParentInput[]
    createMany?: DepartmentCreateManyParentInputEnvelope
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
  }

  export type EmployeeUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<EmployeeCreateWithoutDepartmentInput, EmployeeUncheckedCreateWithoutDepartmentInput> | EmployeeCreateWithoutDepartmentInput[] | EmployeeUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutDepartmentInput | EmployeeCreateOrConnectWithoutDepartmentInput[]
    createMany?: EmployeeCreateManyDepartmentInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type PositionUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<PositionCreateWithoutDepartmentInput, PositionUncheckedCreateWithoutDepartmentInput> | PositionCreateWithoutDepartmentInput[] | PositionUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutDepartmentInput | PositionCreateOrConnectWithoutDepartmentInput[]
    createMany?: PositionCreateManyDepartmentInputEnvelope
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
  }

  export type DepartmentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<DepartmentCreateWithoutParentInput, DepartmentUncheckedCreateWithoutParentInput> | DepartmentCreateWithoutParentInput[] | DepartmentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutParentInput | DepartmentCreateOrConnectWithoutParentInput[]
    createMany?: DepartmentCreateManyParentInputEnvelope
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
  }

  export type EnumDepartmentTypeFieldUpdateOperationsInput = {
    set?: $Enums.DepartmentType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EmployeeUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<EmployeeCreateWithoutDepartmentInput, EmployeeUncheckedCreateWithoutDepartmentInput> | EmployeeCreateWithoutDepartmentInput[] | EmployeeUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutDepartmentInput | EmployeeCreateOrConnectWithoutDepartmentInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutDepartmentInput | EmployeeUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: EmployeeCreateManyDepartmentInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutDepartmentInput | EmployeeUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutDepartmentInput | EmployeeUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type PositionUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<PositionCreateWithoutDepartmentInput, PositionUncheckedCreateWithoutDepartmentInput> | PositionCreateWithoutDepartmentInput[] | PositionUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutDepartmentInput | PositionCreateOrConnectWithoutDepartmentInput[]
    upsert?: PositionUpsertWithWhereUniqueWithoutDepartmentInput | PositionUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: PositionCreateManyDepartmentInputEnvelope
    set?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    disconnect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    delete?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    update?: PositionUpdateWithWhereUniqueWithoutDepartmentInput | PositionUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: PositionUpdateManyWithWhereWithoutDepartmentInput | PositionUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: PositionScalarWhereInput | PositionScalarWhereInput[]
  }

  export type DepartmentUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<DepartmentCreateWithoutChildrenInput, DepartmentUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutChildrenInput
    upsert?: DepartmentUpsertWithoutChildrenInput
    disconnect?: DepartmentWhereInput | boolean
    delete?: DepartmentWhereInput | boolean
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutChildrenInput, DepartmentUpdateWithoutChildrenInput>, DepartmentUncheckedUpdateWithoutChildrenInput>
  }

  export type DepartmentUpdateManyWithoutParentNestedInput = {
    create?: XOR<DepartmentCreateWithoutParentInput, DepartmentUncheckedCreateWithoutParentInput> | DepartmentCreateWithoutParentInput[] | DepartmentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutParentInput | DepartmentCreateOrConnectWithoutParentInput[]
    upsert?: DepartmentUpsertWithWhereUniqueWithoutParentInput | DepartmentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: DepartmentCreateManyParentInputEnvelope
    set?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    disconnect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    delete?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    update?: DepartmentUpdateWithWhereUniqueWithoutParentInput | DepartmentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: DepartmentUpdateManyWithWhereWithoutParentInput | DepartmentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
  }

  export type EmployeeUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<EmployeeCreateWithoutDepartmentInput, EmployeeUncheckedCreateWithoutDepartmentInput> | EmployeeCreateWithoutDepartmentInput[] | EmployeeUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutDepartmentInput | EmployeeCreateOrConnectWithoutDepartmentInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutDepartmentInput | EmployeeUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: EmployeeCreateManyDepartmentInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutDepartmentInput | EmployeeUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutDepartmentInput | EmployeeUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type PositionUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<PositionCreateWithoutDepartmentInput, PositionUncheckedCreateWithoutDepartmentInput> | PositionCreateWithoutDepartmentInput[] | PositionUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PositionCreateOrConnectWithoutDepartmentInput | PositionCreateOrConnectWithoutDepartmentInput[]
    upsert?: PositionUpsertWithWhereUniqueWithoutDepartmentInput | PositionUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: PositionCreateManyDepartmentInputEnvelope
    set?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    disconnect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    delete?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    connect?: PositionWhereUniqueInput | PositionWhereUniqueInput[]
    update?: PositionUpdateWithWhereUniqueWithoutDepartmentInput | PositionUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: PositionUpdateManyWithWhereWithoutDepartmentInput | PositionUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: PositionScalarWhereInput | PositionScalarWhereInput[]
  }

  export type DepartmentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<DepartmentCreateWithoutParentInput, DepartmentUncheckedCreateWithoutParentInput> | DepartmentCreateWithoutParentInput[] | DepartmentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: DepartmentCreateOrConnectWithoutParentInput | DepartmentCreateOrConnectWithoutParentInput[]
    upsert?: DepartmentUpsertWithWhereUniqueWithoutParentInput | DepartmentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: DepartmentCreateManyParentInputEnvelope
    set?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    disconnect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    delete?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    connect?: DepartmentWhereUniqueInput | DepartmentWhereUniqueInput[]
    update?: DepartmentUpdateWithWhereUniqueWithoutParentInput | DepartmentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: DepartmentUpdateManyWithWhereWithoutParentInput | DepartmentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
  }

  export type EmployeeCreateNestedManyWithoutPositionInput = {
    create?: XOR<EmployeeCreateWithoutPositionInput, EmployeeUncheckedCreateWithoutPositionInput> | EmployeeCreateWithoutPositionInput[] | EmployeeUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutPositionInput | EmployeeCreateOrConnectWithoutPositionInput[]
    createMany?: EmployeeCreateManyPositionInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type DepartmentCreateNestedOneWithoutPositionsInput = {
    create?: XOR<DepartmentCreateWithoutPositionsInput, DepartmentUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutPositionsInput
    connect?: DepartmentWhereUniqueInput
  }

  export type EmployeeUncheckedCreateNestedManyWithoutPositionInput = {
    create?: XOR<EmployeeCreateWithoutPositionInput, EmployeeUncheckedCreateWithoutPositionInput> | EmployeeCreateWithoutPositionInput[] | EmployeeUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutPositionInput | EmployeeCreateOrConnectWithoutPositionInput[]
    createMany?: EmployeeCreateManyPositionInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EmployeeUpdateManyWithoutPositionNestedInput = {
    create?: XOR<EmployeeCreateWithoutPositionInput, EmployeeUncheckedCreateWithoutPositionInput> | EmployeeCreateWithoutPositionInput[] | EmployeeUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutPositionInput | EmployeeCreateOrConnectWithoutPositionInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutPositionInput | EmployeeUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: EmployeeCreateManyPositionInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutPositionInput | EmployeeUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutPositionInput | EmployeeUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type DepartmentUpdateOneRequiredWithoutPositionsNestedInput = {
    create?: XOR<DepartmentCreateWithoutPositionsInput, DepartmentUncheckedCreateWithoutPositionsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutPositionsInput
    upsert?: DepartmentUpsertWithoutPositionsInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutPositionsInput, DepartmentUpdateWithoutPositionsInput>, DepartmentUncheckedUpdateWithoutPositionsInput>
  }

  export type EmployeeUncheckedUpdateManyWithoutPositionNestedInput = {
    create?: XOR<EmployeeCreateWithoutPositionInput, EmployeeUncheckedCreateWithoutPositionInput> | EmployeeCreateWithoutPositionInput[] | EmployeeUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutPositionInput | EmployeeCreateOrConnectWithoutPositionInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutPositionInput | EmployeeUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: EmployeeCreateManyPositionInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutPositionInput | EmployeeUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutPositionInput | EmployeeUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type DepartmentCreateNestedOneWithoutEmployeesInput = {
    create?: XOR<DepartmentCreateWithoutEmployeesInput, DepartmentUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutEmployeesInput
    connect?: DepartmentWhereUniqueInput
  }

  export type PositionCreateNestedOneWithoutEmployeesInput = {
    create?: XOR<PositionCreateWithoutEmployeesInput, PositionUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: PositionCreateOrConnectWithoutEmployeesInput
    connect?: PositionWhereUniqueInput
  }

  export type EmployeeCreateNestedOneWithoutDirectReportsInput = {
    create?: XOR<EmployeeCreateWithoutDirectReportsInput, EmployeeUncheckedCreateWithoutDirectReportsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutDirectReportsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type EmployeeCreateNestedManyWithoutManagerInput = {
    create?: XOR<EmployeeCreateWithoutManagerInput, EmployeeUncheckedCreateWithoutManagerInput> | EmployeeCreateWithoutManagerInput[] | EmployeeUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutManagerInput | EmployeeCreateOrConnectWithoutManagerInput[]
    createMany?: EmployeeCreateManyManagerInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type AttendanceCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<AttendanceCreateWithoutEmployeeInput, AttendanceUncheckedCreateWithoutEmployeeInput> | AttendanceCreateWithoutEmployeeInput[] | AttendanceUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutEmployeeInput | AttendanceCreateOrConnectWithoutEmployeeInput[]
    createMany?: AttendanceCreateManyEmployeeInputEnvelope
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
  }

  export type ShiftAssignmentCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<ShiftAssignmentCreateWithoutEmployeeInput, ShiftAssignmentUncheckedCreateWithoutEmployeeInput> | ShiftAssignmentCreateWithoutEmployeeInput[] | ShiftAssignmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutEmployeeInput | ShiftAssignmentCreateOrConnectWithoutEmployeeInput[]
    createMany?: ShiftAssignmentCreateManyEmployeeInputEnvelope
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
  }

  export type LeaveRequestCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<LeaveRequestCreateWithoutEmployeeInput, LeaveRequestUncheckedCreateWithoutEmployeeInput> | LeaveRequestCreateWithoutEmployeeInput[] | LeaveRequestUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: LeaveRequestCreateOrConnectWithoutEmployeeInput | LeaveRequestCreateOrConnectWithoutEmployeeInput[]
    createMany?: LeaveRequestCreateManyEmployeeInputEnvelope
    connect?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
  }

  export type PayrollCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<PayrollCreateWithoutEmployeeInput, PayrollUncheckedCreateWithoutEmployeeInput> | PayrollCreateWithoutEmployeeInput[] | PayrollUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PayrollCreateOrConnectWithoutEmployeeInput | PayrollCreateOrConnectWithoutEmployeeInput[]
    createMany?: PayrollCreateManyEmployeeInputEnvelope
    connect?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
  }

  export type PerformanceReviewCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<PerformanceReviewCreateWithoutEmployeeInput, PerformanceReviewUncheckedCreateWithoutEmployeeInput> | PerformanceReviewCreateWithoutEmployeeInput[] | PerformanceReviewUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PerformanceReviewCreateOrConnectWithoutEmployeeInput | PerformanceReviewCreateOrConnectWithoutEmployeeInput[]
    createMany?: PerformanceReviewCreateManyEmployeeInputEnvelope
    connect?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
  }

  export type TrainingEnrollmentCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutEmployeeInput, TrainingEnrollmentUncheckedCreateWithoutEmployeeInput> | TrainingEnrollmentCreateWithoutEmployeeInput[] | TrainingEnrollmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutEmployeeInput | TrainingEnrollmentCreateOrConnectWithoutEmployeeInput[]
    createMany?: TrainingEnrollmentCreateManyEmployeeInputEnvelope
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
  }

  export type EmployeeUncheckedCreateNestedManyWithoutManagerInput = {
    create?: XOR<EmployeeCreateWithoutManagerInput, EmployeeUncheckedCreateWithoutManagerInput> | EmployeeCreateWithoutManagerInput[] | EmployeeUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutManagerInput | EmployeeCreateOrConnectWithoutManagerInput[]
    createMany?: EmployeeCreateManyManagerInputEnvelope
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
  }

  export type AttendanceUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<AttendanceCreateWithoutEmployeeInput, AttendanceUncheckedCreateWithoutEmployeeInput> | AttendanceCreateWithoutEmployeeInput[] | AttendanceUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutEmployeeInput | AttendanceCreateOrConnectWithoutEmployeeInput[]
    createMany?: AttendanceCreateManyEmployeeInputEnvelope
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
  }

  export type ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<ShiftAssignmentCreateWithoutEmployeeInput, ShiftAssignmentUncheckedCreateWithoutEmployeeInput> | ShiftAssignmentCreateWithoutEmployeeInput[] | ShiftAssignmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutEmployeeInput | ShiftAssignmentCreateOrConnectWithoutEmployeeInput[]
    createMany?: ShiftAssignmentCreateManyEmployeeInputEnvelope
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
  }

  export type LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<LeaveRequestCreateWithoutEmployeeInput, LeaveRequestUncheckedCreateWithoutEmployeeInput> | LeaveRequestCreateWithoutEmployeeInput[] | LeaveRequestUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: LeaveRequestCreateOrConnectWithoutEmployeeInput | LeaveRequestCreateOrConnectWithoutEmployeeInput[]
    createMany?: LeaveRequestCreateManyEmployeeInputEnvelope
    connect?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
  }

  export type PayrollUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<PayrollCreateWithoutEmployeeInput, PayrollUncheckedCreateWithoutEmployeeInput> | PayrollCreateWithoutEmployeeInput[] | PayrollUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PayrollCreateOrConnectWithoutEmployeeInput | PayrollCreateOrConnectWithoutEmployeeInput[]
    createMany?: PayrollCreateManyEmployeeInputEnvelope
    connect?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
  }

  export type PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<PerformanceReviewCreateWithoutEmployeeInput, PerformanceReviewUncheckedCreateWithoutEmployeeInput> | PerformanceReviewCreateWithoutEmployeeInput[] | PerformanceReviewUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PerformanceReviewCreateOrConnectWithoutEmployeeInput | PerformanceReviewCreateOrConnectWithoutEmployeeInput[]
    createMany?: PerformanceReviewCreateManyEmployeeInputEnvelope
    connect?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
  }

  export type TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutEmployeeInput, TrainingEnrollmentUncheckedCreateWithoutEmployeeInput> | TrainingEnrollmentCreateWithoutEmployeeInput[] | TrainingEnrollmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutEmployeeInput | TrainingEnrollmentCreateOrConnectWithoutEmployeeInput[]
    createMany?: TrainingEnrollmentCreateManyEmployeeInputEnvelope
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumEmployeeStatusFieldUpdateOperationsInput = {
    set?: $Enums.EmployeeStatus
  }

  export type DepartmentUpdateOneRequiredWithoutEmployeesNestedInput = {
    create?: XOR<DepartmentCreateWithoutEmployeesInput, DepartmentUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutEmployeesInput
    upsert?: DepartmentUpsertWithoutEmployeesInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutEmployeesInput, DepartmentUpdateWithoutEmployeesInput>, DepartmentUncheckedUpdateWithoutEmployeesInput>
  }

  export type PositionUpdateOneRequiredWithoutEmployeesNestedInput = {
    create?: XOR<PositionCreateWithoutEmployeesInput, PositionUncheckedCreateWithoutEmployeesInput>
    connectOrCreate?: PositionCreateOrConnectWithoutEmployeesInput
    upsert?: PositionUpsertWithoutEmployeesInput
    connect?: PositionWhereUniqueInput
    update?: XOR<XOR<PositionUpdateToOneWithWhereWithoutEmployeesInput, PositionUpdateWithoutEmployeesInput>, PositionUncheckedUpdateWithoutEmployeesInput>
  }

  export type EmployeeUpdateOneWithoutDirectReportsNestedInput = {
    create?: XOR<EmployeeCreateWithoutDirectReportsInput, EmployeeUncheckedCreateWithoutDirectReportsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutDirectReportsInput
    upsert?: EmployeeUpsertWithoutDirectReportsInput
    disconnect?: EmployeeWhereInput | boolean
    delete?: EmployeeWhereInput | boolean
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutDirectReportsInput, EmployeeUpdateWithoutDirectReportsInput>, EmployeeUncheckedUpdateWithoutDirectReportsInput>
  }

  export type EmployeeUpdateManyWithoutManagerNestedInput = {
    create?: XOR<EmployeeCreateWithoutManagerInput, EmployeeUncheckedCreateWithoutManagerInput> | EmployeeCreateWithoutManagerInput[] | EmployeeUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutManagerInput | EmployeeCreateOrConnectWithoutManagerInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutManagerInput | EmployeeUpsertWithWhereUniqueWithoutManagerInput[]
    createMany?: EmployeeCreateManyManagerInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutManagerInput | EmployeeUpdateWithWhereUniqueWithoutManagerInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutManagerInput | EmployeeUpdateManyWithWhereWithoutManagerInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type AttendanceUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<AttendanceCreateWithoutEmployeeInput, AttendanceUncheckedCreateWithoutEmployeeInput> | AttendanceCreateWithoutEmployeeInput[] | AttendanceUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutEmployeeInput | AttendanceCreateOrConnectWithoutEmployeeInput[]
    upsert?: AttendanceUpsertWithWhereUniqueWithoutEmployeeInput | AttendanceUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: AttendanceCreateManyEmployeeInputEnvelope
    set?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    disconnect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    delete?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    update?: AttendanceUpdateWithWhereUniqueWithoutEmployeeInput | AttendanceUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: AttendanceUpdateManyWithWhereWithoutEmployeeInput | AttendanceUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
  }

  export type ShiftAssignmentUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<ShiftAssignmentCreateWithoutEmployeeInput, ShiftAssignmentUncheckedCreateWithoutEmployeeInput> | ShiftAssignmentCreateWithoutEmployeeInput[] | ShiftAssignmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutEmployeeInput | ShiftAssignmentCreateOrConnectWithoutEmployeeInput[]
    upsert?: ShiftAssignmentUpsertWithWhereUniqueWithoutEmployeeInput | ShiftAssignmentUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: ShiftAssignmentCreateManyEmployeeInputEnvelope
    set?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    disconnect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    delete?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    update?: ShiftAssignmentUpdateWithWhereUniqueWithoutEmployeeInput | ShiftAssignmentUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: ShiftAssignmentUpdateManyWithWhereWithoutEmployeeInput | ShiftAssignmentUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: ShiftAssignmentScalarWhereInput | ShiftAssignmentScalarWhereInput[]
  }

  export type LeaveRequestUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<LeaveRequestCreateWithoutEmployeeInput, LeaveRequestUncheckedCreateWithoutEmployeeInput> | LeaveRequestCreateWithoutEmployeeInput[] | LeaveRequestUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: LeaveRequestCreateOrConnectWithoutEmployeeInput | LeaveRequestCreateOrConnectWithoutEmployeeInput[]
    upsert?: LeaveRequestUpsertWithWhereUniqueWithoutEmployeeInput | LeaveRequestUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: LeaveRequestCreateManyEmployeeInputEnvelope
    set?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    disconnect?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    delete?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    connect?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    update?: LeaveRequestUpdateWithWhereUniqueWithoutEmployeeInput | LeaveRequestUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: LeaveRequestUpdateManyWithWhereWithoutEmployeeInput | LeaveRequestUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: LeaveRequestScalarWhereInput | LeaveRequestScalarWhereInput[]
  }

  export type PayrollUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<PayrollCreateWithoutEmployeeInput, PayrollUncheckedCreateWithoutEmployeeInput> | PayrollCreateWithoutEmployeeInput[] | PayrollUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PayrollCreateOrConnectWithoutEmployeeInput | PayrollCreateOrConnectWithoutEmployeeInput[]
    upsert?: PayrollUpsertWithWhereUniqueWithoutEmployeeInput | PayrollUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: PayrollCreateManyEmployeeInputEnvelope
    set?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    disconnect?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    delete?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    connect?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    update?: PayrollUpdateWithWhereUniqueWithoutEmployeeInput | PayrollUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: PayrollUpdateManyWithWhereWithoutEmployeeInput | PayrollUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: PayrollScalarWhereInput | PayrollScalarWhereInput[]
  }

  export type PerformanceReviewUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<PerformanceReviewCreateWithoutEmployeeInput, PerformanceReviewUncheckedCreateWithoutEmployeeInput> | PerformanceReviewCreateWithoutEmployeeInput[] | PerformanceReviewUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PerformanceReviewCreateOrConnectWithoutEmployeeInput | PerformanceReviewCreateOrConnectWithoutEmployeeInput[]
    upsert?: PerformanceReviewUpsertWithWhereUniqueWithoutEmployeeInput | PerformanceReviewUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: PerformanceReviewCreateManyEmployeeInputEnvelope
    set?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    disconnect?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    delete?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    connect?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    update?: PerformanceReviewUpdateWithWhereUniqueWithoutEmployeeInput | PerformanceReviewUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: PerformanceReviewUpdateManyWithWhereWithoutEmployeeInput | PerformanceReviewUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: PerformanceReviewScalarWhereInput | PerformanceReviewScalarWhereInput[]
  }

  export type TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutEmployeeInput, TrainingEnrollmentUncheckedCreateWithoutEmployeeInput> | TrainingEnrollmentCreateWithoutEmployeeInput[] | TrainingEnrollmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutEmployeeInput | TrainingEnrollmentCreateOrConnectWithoutEmployeeInput[]
    upsert?: TrainingEnrollmentUpsertWithWhereUniqueWithoutEmployeeInput | TrainingEnrollmentUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: TrainingEnrollmentCreateManyEmployeeInputEnvelope
    set?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    disconnect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    delete?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    update?: TrainingEnrollmentUpdateWithWhereUniqueWithoutEmployeeInput | TrainingEnrollmentUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: TrainingEnrollmentUpdateManyWithWhereWithoutEmployeeInput | TrainingEnrollmentUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: TrainingEnrollmentScalarWhereInput | TrainingEnrollmentScalarWhereInput[]
  }

  export type EmployeeUncheckedUpdateManyWithoutManagerNestedInput = {
    create?: XOR<EmployeeCreateWithoutManagerInput, EmployeeUncheckedCreateWithoutManagerInput> | EmployeeCreateWithoutManagerInput[] | EmployeeUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: EmployeeCreateOrConnectWithoutManagerInput | EmployeeCreateOrConnectWithoutManagerInput[]
    upsert?: EmployeeUpsertWithWhereUniqueWithoutManagerInput | EmployeeUpsertWithWhereUniqueWithoutManagerInput[]
    createMany?: EmployeeCreateManyManagerInputEnvelope
    set?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    disconnect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    delete?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    connect?: EmployeeWhereUniqueInput | EmployeeWhereUniqueInput[]
    update?: EmployeeUpdateWithWhereUniqueWithoutManagerInput | EmployeeUpdateWithWhereUniqueWithoutManagerInput[]
    updateMany?: EmployeeUpdateManyWithWhereWithoutManagerInput | EmployeeUpdateManyWithWhereWithoutManagerInput[]
    deleteMany?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
  }

  export type AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<AttendanceCreateWithoutEmployeeInput, AttendanceUncheckedCreateWithoutEmployeeInput> | AttendanceCreateWithoutEmployeeInput[] | AttendanceUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutEmployeeInput | AttendanceCreateOrConnectWithoutEmployeeInput[]
    upsert?: AttendanceUpsertWithWhereUniqueWithoutEmployeeInput | AttendanceUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: AttendanceCreateManyEmployeeInputEnvelope
    set?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    disconnect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    delete?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    update?: AttendanceUpdateWithWhereUniqueWithoutEmployeeInput | AttendanceUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: AttendanceUpdateManyWithWhereWithoutEmployeeInput | AttendanceUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
  }

  export type ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<ShiftAssignmentCreateWithoutEmployeeInput, ShiftAssignmentUncheckedCreateWithoutEmployeeInput> | ShiftAssignmentCreateWithoutEmployeeInput[] | ShiftAssignmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutEmployeeInput | ShiftAssignmentCreateOrConnectWithoutEmployeeInput[]
    upsert?: ShiftAssignmentUpsertWithWhereUniqueWithoutEmployeeInput | ShiftAssignmentUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: ShiftAssignmentCreateManyEmployeeInputEnvelope
    set?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    disconnect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    delete?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    update?: ShiftAssignmentUpdateWithWhereUniqueWithoutEmployeeInput | ShiftAssignmentUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: ShiftAssignmentUpdateManyWithWhereWithoutEmployeeInput | ShiftAssignmentUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: ShiftAssignmentScalarWhereInput | ShiftAssignmentScalarWhereInput[]
  }

  export type LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<LeaveRequestCreateWithoutEmployeeInput, LeaveRequestUncheckedCreateWithoutEmployeeInput> | LeaveRequestCreateWithoutEmployeeInput[] | LeaveRequestUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: LeaveRequestCreateOrConnectWithoutEmployeeInput | LeaveRequestCreateOrConnectWithoutEmployeeInput[]
    upsert?: LeaveRequestUpsertWithWhereUniqueWithoutEmployeeInput | LeaveRequestUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: LeaveRequestCreateManyEmployeeInputEnvelope
    set?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    disconnect?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    delete?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    connect?: LeaveRequestWhereUniqueInput | LeaveRequestWhereUniqueInput[]
    update?: LeaveRequestUpdateWithWhereUniqueWithoutEmployeeInput | LeaveRequestUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: LeaveRequestUpdateManyWithWhereWithoutEmployeeInput | LeaveRequestUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: LeaveRequestScalarWhereInput | LeaveRequestScalarWhereInput[]
  }

  export type PayrollUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<PayrollCreateWithoutEmployeeInput, PayrollUncheckedCreateWithoutEmployeeInput> | PayrollCreateWithoutEmployeeInput[] | PayrollUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PayrollCreateOrConnectWithoutEmployeeInput | PayrollCreateOrConnectWithoutEmployeeInput[]
    upsert?: PayrollUpsertWithWhereUniqueWithoutEmployeeInput | PayrollUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: PayrollCreateManyEmployeeInputEnvelope
    set?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    disconnect?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    delete?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    connect?: PayrollWhereUniqueInput | PayrollWhereUniqueInput[]
    update?: PayrollUpdateWithWhereUniqueWithoutEmployeeInput | PayrollUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: PayrollUpdateManyWithWhereWithoutEmployeeInput | PayrollUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: PayrollScalarWhereInput | PayrollScalarWhereInput[]
  }

  export type PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<PerformanceReviewCreateWithoutEmployeeInput, PerformanceReviewUncheckedCreateWithoutEmployeeInput> | PerformanceReviewCreateWithoutEmployeeInput[] | PerformanceReviewUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: PerformanceReviewCreateOrConnectWithoutEmployeeInput | PerformanceReviewCreateOrConnectWithoutEmployeeInput[]
    upsert?: PerformanceReviewUpsertWithWhereUniqueWithoutEmployeeInput | PerformanceReviewUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: PerformanceReviewCreateManyEmployeeInputEnvelope
    set?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    disconnect?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    delete?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    connect?: PerformanceReviewWhereUniqueInput | PerformanceReviewWhereUniqueInput[]
    update?: PerformanceReviewUpdateWithWhereUniqueWithoutEmployeeInput | PerformanceReviewUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: PerformanceReviewUpdateManyWithWhereWithoutEmployeeInput | PerformanceReviewUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: PerformanceReviewScalarWhereInput | PerformanceReviewScalarWhereInput[]
  }

  export type TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutEmployeeInput, TrainingEnrollmentUncheckedCreateWithoutEmployeeInput> | TrainingEnrollmentCreateWithoutEmployeeInput[] | TrainingEnrollmentUncheckedCreateWithoutEmployeeInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutEmployeeInput | TrainingEnrollmentCreateOrConnectWithoutEmployeeInput[]
    upsert?: TrainingEnrollmentUpsertWithWhereUniqueWithoutEmployeeInput | TrainingEnrollmentUpsertWithWhereUniqueWithoutEmployeeInput[]
    createMany?: TrainingEnrollmentCreateManyEmployeeInputEnvelope
    set?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    disconnect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    delete?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    update?: TrainingEnrollmentUpdateWithWhereUniqueWithoutEmployeeInput | TrainingEnrollmentUpdateWithWhereUniqueWithoutEmployeeInput[]
    updateMany?: TrainingEnrollmentUpdateManyWithWhereWithoutEmployeeInput | TrainingEnrollmentUpdateManyWithWhereWithoutEmployeeInput[]
    deleteMany?: TrainingEnrollmentScalarWhereInput | TrainingEnrollmentScalarWhereInput[]
  }

  export type EmployeeCreateNestedOneWithoutAttendancesInput = {
    create?: XOR<EmployeeCreateWithoutAttendancesInput, EmployeeUncheckedCreateWithoutAttendancesInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutAttendancesInput
    connect?: EmployeeWhereUniqueInput
  }

  export type EnumAttendanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.AttendanceStatus
  }

  export type EmployeeUpdateOneRequiredWithoutAttendancesNestedInput = {
    create?: XOR<EmployeeCreateWithoutAttendancesInput, EmployeeUncheckedCreateWithoutAttendancesInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutAttendancesInput
    upsert?: EmployeeUpsertWithoutAttendancesInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutAttendancesInput, EmployeeUpdateWithoutAttendancesInput>, EmployeeUncheckedUpdateWithoutAttendancesInput>
  }

  export type ShiftAssignmentCreateNestedManyWithoutShiftInput = {
    create?: XOR<ShiftAssignmentCreateWithoutShiftInput, ShiftAssignmentUncheckedCreateWithoutShiftInput> | ShiftAssignmentCreateWithoutShiftInput[] | ShiftAssignmentUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutShiftInput | ShiftAssignmentCreateOrConnectWithoutShiftInput[]
    createMany?: ShiftAssignmentCreateManyShiftInputEnvelope
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
  }

  export type ShiftAssignmentUncheckedCreateNestedManyWithoutShiftInput = {
    create?: XOR<ShiftAssignmentCreateWithoutShiftInput, ShiftAssignmentUncheckedCreateWithoutShiftInput> | ShiftAssignmentCreateWithoutShiftInput[] | ShiftAssignmentUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutShiftInput | ShiftAssignmentCreateOrConnectWithoutShiftInput[]
    createMany?: ShiftAssignmentCreateManyShiftInputEnvelope
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
  }

  export type ShiftAssignmentUpdateManyWithoutShiftNestedInput = {
    create?: XOR<ShiftAssignmentCreateWithoutShiftInput, ShiftAssignmentUncheckedCreateWithoutShiftInput> | ShiftAssignmentCreateWithoutShiftInput[] | ShiftAssignmentUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutShiftInput | ShiftAssignmentCreateOrConnectWithoutShiftInput[]
    upsert?: ShiftAssignmentUpsertWithWhereUniqueWithoutShiftInput | ShiftAssignmentUpsertWithWhereUniqueWithoutShiftInput[]
    createMany?: ShiftAssignmentCreateManyShiftInputEnvelope
    set?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    disconnect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    delete?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    update?: ShiftAssignmentUpdateWithWhereUniqueWithoutShiftInput | ShiftAssignmentUpdateWithWhereUniqueWithoutShiftInput[]
    updateMany?: ShiftAssignmentUpdateManyWithWhereWithoutShiftInput | ShiftAssignmentUpdateManyWithWhereWithoutShiftInput[]
    deleteMany?: ShiftAssignmentScalarWhereInput | ShiftAssignmentScalarWhereInput[]
  }

  export type ShiftAssignmentUncheckedUpdateManyWithoutShiftNestedInput = {
    create?: XOR<ShiftAssignmentCreateWithoutShiftInput, ShiftAssignmentUncheckedCreateWithoutShiftInput> | ShiftAssignmentCreateWithoutShiftInput[] | ShiftAssignmentUncheckedCreateWithoutShiftInput[]
    connectOrCreate?: ShiftAssignmentCreateOrConnectWithoutShiftInput | ShiftAssignmentCreateOrConnectWithoutShiftInput[]
    upsert?: ShiftAssignmentUpsertWithWhereUniqueWithoutShiftInput | ShiftAssignmentUpsertWithWhereUniqueWithoutShiftInput[]
    createMany?: ShiftAssignmentCreateManyShiftInputEnvelope
    set?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    disconnect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    delete?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    connect?: ShiftAssignmentWhereUniqueInput | ShiftAssignmentWhereUniqueInput[]
    update?: ShiftAssignmentUpdateWithWhereUniqueWithoutShiftInput | ShiftAssignmentUpdateWithWhereUniqueWithoutShiftInput[]
    updateMany?: ShiftAssignmentUpdateManyWithWhereWithoutShiftInput | ShiftAssignmentUpdateManyWithWhereWithoutShiftInput[]
    deleteMany?: ShiftAssignmentScalarWhereInput | ShiftAssignmentScalarWhereInput[]
  }

  export type EmployeeCreateNestedOneWithoutShiftAssignmentsInput = {
    create?: XOR<EmployeeCreateWithoutShiftAssignmentsInput, EmployeeUncheckedCreateWithoutShiftAssignmentsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutShiftAssignmentsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type ShiftCreateNestedOneWithoutAssignmentsInput = {
    create?: XOR<ShiftCreateWithoutAssignmentsInput, ShiftUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: ShiftCreateOrConnectWithoutAssignmentsInput
    connect?: ShiftWhereUniqueInput
  }

  export type EmployeeUpdateOneRequiredWithoutShiftAssignmentsNestedInput = {
    create?: XOR<EmployeeCreateWithoutShiftAssignmentsInput, EmployeeUncheckedCreateWithoutShiftAssignmentsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutShiftAssignmentsInput
    upsert?: EmployeeUpsertWithoutShiftAssignmentsInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutShiftAssignmentsInput, EmployeeUpdateWithoutShiftAssignmentsInput>, EmployeeUncheckedUpdateWithoutShiftAssignmentsInput>
  }

  export type ShiftUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: XOR<ShiftCreateWithoutAssignmentsInput, ShiftUncheckedCreateWithoutAssignmentsInput>
    connectOrCreate?: ShiftCreateOrConnectWithoutAssignmentsInput
    upsert?: ShiftUpsertWithoutAssignmentsInput
    connect?: ShiftWhereUniqueInput
    update?: XOR<XOR<ShiftUpdateToOneWithWhereWithoutAssignmentsInput, ShiftUpdateWithoutAssignmentsInput>, ShiftUncheckedUpdateWithoutAssignmentsInput>
  }

  export type EmployeeCreateNestedOneWithoutLeaveRequestsInput = {
    create?: XOR<EmployeeCreateWithoutLeaveRequestsInput, EmployeeUncheckedCreateWithoutLeaveRequestsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutLeaveRequestsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type EnumLeaveTypeFieldUpdateOperationsInput = {
    set?: $Enums.LeaveType
  }

  export type EnumLeaveStatusFieldUpdateOperationsInput = {
    set?: $Enums.LeaveStatus
  }

  export type EmployeeUpdateOneRequiredWithoutLeaveRequestsNestedInput = {
    create?: XOR<EmployeeCreateWithoutLeaveRequestsInput, EmployeeUncheckedCreateWithoutLeaveRequestsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutLeaveRequestsInput
    upsert?: EmployeeUpsertWithoutLeaveRequestsInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutLeaveRequestsInput, EmployeeUpdateWithoutLeaveRequestsInput>, EmployeeUncheckedUpdateWithoutLeaveRequestsInput>
  }

  export type EmployeeCreateNestedOneWithoutPayrollsInput = {
    create?: XOR<EmployeeCreateWithoutPayrollsInput, EmployeeUncheckedCreateWithoutPayrollsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutPayrollsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type EnumPayrollStatusFieldUpdateOperationsInput = {
    set?: $Enums.PayrollStatus
  }

  export type EmployeeUpdateOneRequiredWithoutPayrollsNestedInput = {
    create?: XOR<EmployeeCreateWithoutPayrollsInput, EmployeeUncheckedCreateWithoutPayrollsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutPayrollsInput
    upsert?: EmployeeUpsertWithoutPayrollsInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutPayrollsInput, EmployeeUpdateWithoutPayrollsInput>, EmployeeUncheckedUpdateWithoutPayrollsInput>
  }

  export type EmployeeCreateNestedOneWithoutPerformancesInput = {
    create?: XOR<EmployeeCreateWithoutPerformancesInput, EmployeeUncheckedCreateWithoutPerformancesInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutPerformancesInput
    connect?: EmployeeWhereUniqueInput
  }

  export type EnumPerformanceRatingFieldUpdateOperationsInput = {
    set?: $Enums.PerformanceRating
  }

  export type EmployeeUpdateOneRequiredWithoutPerformancesNestedInput = {
    create?: XOR<EmployeeCreateWithoutPerformancesInput, EmployeeUncheckedCreateWithoutPerformancesInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutPerformancesInput
    upsert?: EmployeeUpsertWithoutPerformancesInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutPerformancesInput, EmployeeUpdateWithoutPerformancesInput>, EmployeeUncheckedUpdateWithoutPerformancesInput>
  }

  export type TrainingEnrollmentCreateNestedManyWithoutTrainingInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutTrainingInput, TrainingEnrollmentUncheckedCreateWithoutTrainingInput> | TrainingEnrollmentCreateWithoutTrainingInput[] | TrainingEnrollmentUncheckedCreateWithoutTrainingInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutTrainingInput | TrainingEnrollmentCreateOrConnectWithoutTrainingInput[]
    createMany?: TrainingEnrollmentCreateManyTrainingInputEnvelope
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
  }

  export type TrainingEnrollmentUncheckedCreateNestedManyWithoutTrainingInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutTrainingInput, TrainingEnrollmentUncheckedCreateWithoutTrainingInput> | TrainingEnrollmentCreateWithoutTrainingInput[] | TrainingEnrollmentUncheckedCreateWithoutTrainingInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutTrainingInput | TrainingEnrollmentCreateOrConnectWithoutTrainingInput[]
    createMany?: TrainingEnrollmentCreateManyTrainingInputEnvelope
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTrainingStatusFieldUpdateOperationsInput = {
    set?: $Enums.TrainingStatus
  }

  export type TrainingEnrollmentUpdateManyWithoutTrainingNestedInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutTrainingInput, TrainingEnrollmentUncheckedCreateWithoutTrainingInput> | TrainingEnrollmentCreateWithoutTrainingInput[] | TrainingEnrollmentUncheckedCreateWithoutTrainingInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutTrainingInput | TrainingEnrollmentCreateOrConnectWithoutTrainingInput[]
    upsert?: TrainingEnrollmentUpsertWithWhereUniqueWithoutTrainingInput | TrainingEnrollmentUpsertWithWhereUniqueWithoutTrainingInput[]
    createMany?: TrainingEnrollmentCreateManyTrainingInputEnvelope
    set?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    disconnect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    delete?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    update?: TrainingEnrollmentUpdateWithWhereUniqueWithoutTrainingInput | TrainingEnrollmentUpdateWithWhereUniqueWithoutTrainingInput[]
    updateMany?: TrainingEnrollmentUpdateManyWithWhereWithoutTrainingInput | TrainingEnrollmentUpdateManyWithWhereWithoutTrainingInput[]
    deleteMany?: TrainingEnrollmentScalarWhereInput | TrainingEnrollmentScalarWhereInput[]
  }

  export type TrainingEnrollmentUncheckedUpdateManyWithoutTrainingNestedInput = {
    create?: XOR<TrainingEnrollmentCreateWithoutTrainingInput, TrainingEnrollmentUncheckedCreateWithoutTrainingInput> | TrainingEnrollmentCreateWithoutTrainingInput[] | TrainingEnrollmentUncheckedCreateWithoutTrainingInput[]
    connectOrCreate?: TrainingEnrollmentCreateOrConnectWithoutTrainingInput | TrainingEnrollmentCreateOrConnectWithoutTrainingInput[]
    upsert?: TrainingEnrollmentUpsertWithWhereUniqueWithoutTrainingInput | TrainingEnrollmentUpsertWithWhereUniqueWithoutTrainingInput[]
    createMany?: TrainingEnrollmentCreateManyTrainingInputEnvelope
    set?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    disconnect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    delete?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    connect?: TrainingEnrollmentWhereUniqueInput | TrainingEnrollmentWhereUniqueInput[]
    update?: TrainingEnrollmentUpdateWithWhereUniqueWithoutTrainingInput | TrainingEnrollmentUpdateWithWhereUniqueWithoutTrainingInput[]
    updateMany?: TrainingEnrollmentUpdateManyWithWhereWithoutTrainingInput | TrainingEnrollmentUpdateManyWithWhereWithoutTrainingInput[]
    deleteMany?: TrainingEnrollmentScalarWhereInput | TrainingEnrollmentScalarWhereInput[]
  }

  export type EmployeeCreateNestedOneWithoutTrainingEnrollmentsInput = {
    create?: XOR<EmployeeCreateWithoutTrainingEnrollmentsInput, EmployeeUncheckedCreateWithoutTrainingEnrollmentsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutTrainingEnrollmentsInput
    connect?: EmployeeWhereUniqueInput
  }

  export type TrainingCreateNestedOneWithoutEnrollmentsInput = {
    create?: XOR<TrainingCreateWithoutEnrollmentsInput, TrainingUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: TrainingCreateOrConnectWithoutEnrollmentsInput
    connect?: TrainingWhereUniqueInput
  }

  export type EmployeeUpdateOneRequiredWithoutTrainingEnrollmentsNestedInput = {
    create?: XOR<EmployeeCreateWithoutTrainingEnrollmentsInput, EmployeeUncheckedCreateWithoutTrainingEnrollmentsInput>
    connectOrCreate?: EmployeeCreateOrConnectWithoutTrainingEnrollmentsInput
    upsert?: EmployeeUpsertWithoutTrainingEnrollmentsInput
    connect?: EmployeeWhereUniqueInput
    update?: XOR<XOR<EmployeeUpdateToOneWithWhereWithoutTrainingEnrollmentsInput, EmployeeUpdateWithoutTrainingEnrollmentsInput>, EmployeeUncheckedUpdateWithoutTrainingEnrollmentsInput>
  }

  export type TrainingUpdateOneRequiredWithoutEnrollmentsNestedInput = {
    create?: XOR<TrainingCreateWithoutEnrollmentsInput, TrainingUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: TrainingCreateOrConnectWithoutEnrollmentsInput
    upsert?: TrainingUpsertWithoutEnrollmentsInput
    connect?: TrainingWhereUniqueInput
    update?: XOR<XOR<TrainingUpdateToOneWithWhereWithoutEnrollmentsInput, TrainingUpdateWithoutEnrollmentsInput>, TrainingUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDepartmentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DepartmentType | EnumDepartmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDepartmentTypeFilter<$PrismaModel> | $Enums.DepartmentType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumDepartmentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DepartmentType | EnumDepartmentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DepartmentType[] | ListEnumDepartmentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDepartmentTypeWithAggregatesFilter<$PrismaModel> | $Enums.DepartmentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDepartmentTypeFilter<$PrismaModel>
    _max?: NestedEnumDepartmentTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumEmployeeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEmployeeStatusFilter<$PrismaModel> | $Enums.EmployeeStatus
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumEmployeeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EmployeeStatus | EnumEmployeeStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EmployeeStatus[] | ListEnumEmployeeStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEmployeeStatusWithAggregatesFilter<$PrismaModel> | $Enums.EmployeeStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEmployeeStatusFilter<$PrismaModel>
    _max?: NestedEnumEmployeeStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAttendanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusFilter<$PrismaModel> | $Enums.AttendanceStatus
  }

  export type NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AttendanceStatus[] | ListEnumAttendanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.AttendanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttendanceStatusFilter<$PrismaModel>
    _max?: NestedEnumAttendanceStatusFilter<$PrismaModel>
  }

  export type NestedEnumLeaveTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveType | EnumLeaveTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveTypeFilter<$PrismaModel> | $Enums.LeaveType
  }

  export type NestedEnumLeaveStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveStatus | EnumLeaveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveStatusFilter<$PrismaModel> | $Enums.LeaveStatus
  }

  export type NestedEnumLeaveTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveType | EnumLeaveTypeFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveType[] | ListEnumLeaveTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveTypeWithAggregatesFilter<$PrismaModel> | $Enums.LeaveType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeaveTypeFilter<$PrismaModel>
    _max?: NestedEnumLeaveTypeFilter<$PrismaModel>
  }

  export type NestedEnumLeaveStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeaveStatus | EnumLeaveStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeaveStatus[] | ListEnumLeaveStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeaveStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeaveStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeaveStatusFilter<$PrismaModel>
    _max?: NestedEnumLeaveStatusFilter<$PrismaModel>
  }

  export type NestedEnumPayrollStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusFilter<$PrismaModel> | $Enums.PayrollStatus
  }

  export type NestedEnumPayrollStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollStatusFilter<$PrismaModel>
  }

  export type NestedEnumPerformanceRatingFilter<$PrismaModel = never> = {
    equals?: $Enums.PerformanceRating | EnumPerformanceRatingFieldRefInput<$PrismaModel>
    in?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumPerformanceRatingFilter<$PrismaModel> | $Enums.PerformanceRating
  }

  export type NestedEnumPerformanceRatingWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PerformanceRating | EnumPerformanceRatingFieldRefInput<$PrismaModel>
    in?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    notIn?: $Enums.PerformanceRating[] | ListEnumPerformanceRatingFieldRefInput<$PrismaModel>
    not?: NestedEnumPerformanceRatingWithAggregatesFilter<$PrismaModel> | $Enums.PerformanceRating
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPerformanceRatingFilter<$PrismaModel>
    _max?: NestedEnumPerformanceRatingFilter<$PrismaModel>
  }

  export type NestedEnumTrainingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingStatus | EnumTrainingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingStatusFilter<$PrismaModel> | $Enums.TrainingStatus
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTrainingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrainingStatus | EnumTrainingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrainingStatus[] | ListEnumTrainingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrainingStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrainingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrainingStatusFilter<$PrismaModel>
    _max?: NestedEnumTrainingStatusFilter<$PrismaModel>
  }

  export type EmployeeCreateWithoutDepartmentInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutDepartmentInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutDepartmentInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutDepartmentInput, EmployeeUncheckedCreateWithoutDepartmentInput>
  }

  export type EmployeeCreateManyDepartmentInputEnvelope = {
    data: EmployeeCreateManyDepartmentInput | EmployeeCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type PositionCreateWithoutDepartmentInput = {
    id?: string
    title: string
    code: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeCreateNestedManyWithoutPositionInput
  }

  export type PositionUncheckedCreateWithoutDepartmentInput = {
    id?: string
    title: string
    code: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeUncheckedCreateNestedManyWithoutPositionInput
  }

  export type PositionCreateOrConnectWithoutDepartmentInput = {
    where: PositionWhereUniqueInput
    create: XOR<PositionCreateWithoutDepartmentInput, PositionUncheckedCreateWithoutDepartmentInput>
  }

  export type PositionCreateManyDepartmentInputEnvelope = {
    data: PositionCreateManyDepartmentInput | PositionCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentCreateWithoutChildrenInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeCreateNestedManyWithoutDepartmentInput
    positions?: PositionCreateNestedManyWithoutDepartmentInput
    parent?: DepartmentCreateNestedOneWithoutChildrenInput
  }

  export type DepartmentUncheckedCreateWithoutChildrenInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    parentId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeUncheckedCreateNestedManyWithoutDepartmentInput
    positions?: PositionUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutChildrenInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutChildrenInput, DepartmentUncheckedCreateWithoutChildrenInput>
  }

  export type DepartmentCreateWithoutParentInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeCreateNestedManyWithoutDepartmentInput
    positions?: PositionCreateNestedManyWithoutDepartmentInput
    children?: DepartmentCreateNestedManyWithoutParentInput
  }

  export type DepartmentUncheckedCreateWithoutParentInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeUncheckedCreateNestedManyWithoutDepartmentInput
    positions?: PositionUncheckedCreateNestedManyWithoutDepartmentInput
    children?: DepartmentUncheckedCreateNestedManyWithoutParentInput
  }

  export type DepartmentCreateOrConnectWithoutParentInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutParentInput, DepartmentUncheckedCreateWithoutParentInput>
  }

  export type DepartmentCreateManyParentInputEnvelope = {
    data: DepartmentCreateManyParentInput | DepartmentCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type EmployeeUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: EmployeeWhereUniqueInput
    update: XOR<EmployeeUpdateWithoutDepartmentInput, EmployeeUncheckedUpdateWithoutDepartmentInput>
    create: XOR<EmployeeCreateWithoutDepartmentInput, EmployeeUncheckedCreateWithoutDepartmentInput>
  }

  export type EmployeeUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: EmployeeWhereUniqueInput
    data: XOR<EmployeeUpdateWithoutDepartmentInput, EmployeeUncheckedUpdateWithoutDepartmentInput>
  }

  export type EmployeeUpdateManyWithWhereWithoutDepartmentInput = {
    where: EmployeeScalarWhereInput
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type EmployeeScalarWhereInput = {
    AND?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
    OR?: EmployeeScalarWhereInput[]
    NOT?: EmployeeScalarWhereInput | EmployeeScalarWhereInput[]
    id?: StringFilter<"Employee"> | string
    employeeNumber?: StringFilter<"Employee"> | string
    tollgateUserId?: StringNullableFilter<"Employee"> | string | null
    firstName?: StringFilter<"Employee"> | string
    lastName?: StringFilter<"Employee"> | string
    email?: StringFilter<"Employee"> | string
    phone?: StringNullableFilter<"Employee"> | string | null
    nrcNumber?: StringNullableFilter<"Employee"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"Employee"> | Date | string | null
    gender?: StringNullableFilter<"Employee"> | string | null
    address?: StringNullableFilter<"Employee"> | string | null
    emergencyContact?: StringNullableFilter<"Employee"> | string | null
    emergencyPhone?: StringNullableFilter<"Employee"> | string | null
    departmentId?: StringFilter<"Employee"> | string
    positionId?: StringFilter<"Employee"> | string
    managerId?: StringNullableFilter<"Employee"> | string | null
    hireDate?: DateTimeFilter<"Employee"> | Date | string
    salary?: DecimalFilter<"Employee"> | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFilter<"Employee"> | $Enums.EmployeeStatus
    terminationDate?: DateTimeNullableFilter<"Employee"> | Date | string | null
    profilePhoto?: StringNullableFilter<"Employee"> | string | null
    notes?: StringNullableFilter<"Employee"> | string | null
    metadata?: JsonNullableFilter<"Employee">
    createdAt?: DateTimeFilter<"Employee"> | Date | string
    updatedAt?: DateTimeFilter<"Employee"> | Date | string
  }

  export type PositionUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: PositionWhereUniqueInput
    update: XOR<PositionUpdateWithoutDepartmentInput, PositionUncheckedUpdateWithoutDepartmentInput>
    create: XOR<PositionCreateWithoutDepartmentInput, PositionUncheckedCreateWithoutDepartmentInput>
  }

  export type PositionUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: PositionWhereUniqueInput
    data: XOR<PositionUpdateWithoutDepartmentInput, PositionUncheckedUpdateWithoutDepartmentInput>
  }

  export type PositionUpdateManyWithWhereWithoutDepartmentInput = {
    where: PositionScalarWhereInput
    data: XOR<PositionUpdateManyMutationInput, PositionUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type PositionScalarWhereInput = {
    AND?: PositionScalarWhereInput | PositionScalarWhereInput[]
    OR?: PositionScalarWhereInput[]
    NOT?: PositionScalarWhereInput | PositionScalarWhereInput[]
    id?: StringFilter<"Position"> | string
    title?: StringFilter<"Position"> | string
    code?: StringFilter<"Position"> | string
    departmentId?: StringFilter<"Position"> | string
    level?: IntFilter<"Position"> | number
    minSalary?: DecimalNullableFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    maxSalary?: DecimalNullableFilter<"Position"> | Decimal | DecimalJsLike | number | string | null
    description?: StringNullableFilter<"Position"> | string | null
    status?: StringFilter<"Position"> | string
    createdAt?: DateTimeFilter<"Position"> | Date | string
    updatedAt?: DateTimeFilter<"Position"> | Date | string
  }

  export type DepartmentUpsertWithoutChildrenInput = {
    update: XOR<DepartmentUpdateWithoutChildrenInput, DepartmentUncheckedUpdateWithoutChildrenInput>
    create: XOR<DepartmentCreateWithoutChildrenInput, DepartmentUncheckedCreateWithoutChildrenInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutChildrenInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutChildrenInput, DepartmentUncheckedUpdateWithoutChildrenInput>
  }

  export type DepartmentUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUpdateManyWithoutDepartmentNestedInput
    positions?: PositionUpdateManyWithoutDepartmentNestedInput
    parent?: DepartmentUpdateOneWithoutChildrenNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUncheckedUpdateManyWithoutDepartmentNestedInput
    positions?: PositionUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUpsertWithWhereUniqueWithoutParentInput = {
    where: DepartmentWhereUniqueInput
    update: XOR<DepartmentUpdateWithoutParentInput, DepartmentUncheckedUpdateWithoutParentInput>
    create: XOR<DepartmentCreateWithoutParentInput, DepartmentUncheckedCreateWithoutParentInput>
  }

  export type DepartmentUpdateWithWhereUniqueWithoutParentInput = {
    where: DepartmentWhereUniqueInput
    data: XOR<DepartmentUpdateWithoutParentInput, DepartmentUncheckedUpdateWithoutParentInput>
  }

  export type DepartmentUpdateManyWithWhereWithoutParentInput = {
    where: DepartmentScalarWhereInput
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyWithoutParentInput>
  }

  export type DepartmentScalarWhereInput = {
    AND?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
    OR?: DepartmentScalarWhereInput[]
    NOT?: DepartmentScalarWhereInput | DepartmentScalarWhereInput[]
    id?: StringFilter<"Department"> | string
    name?: StringFilter<"Department"> | string
    code?: StringFilter<"Department"> | string
    type?: EnumDepartmentTypeFilter<"Department"> | $Enums.DepartmentType
    description?: StringNullableFilter<"Department"> | string | null
    managerId?: StringNullableFilter<"Department"> | string | null
    parentId?: StringNullableFilter<"Department"> | string | null
    status?: StringFilter<"Department"> | string
    createdAt?: DateTimeFilter<"Department"> | Date | string
    updatedAt?: DateTimeFilter<"Department"> | Date | string
  }

  export type EmployeeCreateWithoutPositionInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutPositionInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutPositionInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutPositionInput, EmployeeUncheckedCreateWithoutPositionInput>
  }

  export type EmployeeCreateManyPositionInputEnvelope = {
    data: EmployeeCreateManyPositionInput | EmployeeCreateManyPositionInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentCreateWithoutPositionsInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeCreateNestedManyWithoutDepartmentInput
    parent?: DepartmentCreateNestedOneWithoutChildrenInput
    children?: DepartmentCreateNestedManyWithoutParentInput
  }

  export type DepartmentUncheckedCreateWithoutPositionsInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    parentId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    employees?: EmployeeUncheckedCreateNestedManyWithoutDepartmentInput
    children?: DepartmentUncheckedCreateNestedManyWithoutParentInput
  }

  export type DepartmentCreateOrConnectWithoutPositionsInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutPositionsInput, DepartmentUncheckedCreateWithoutPositionsInput>
  }

  export type EmployeeUpsertWithWhereUniqueWithoutPositionInput = {
    where: EmployeeWhereUniqueInput
    update: XOR<EmployeeUpdateWithoutPositionInput, EmployeeUncheckedUpdateWithoutPositionInput>
    create: XOR<EmployeeCreateWithoutPositionInput, EmployeeUncheckedCreateWithoutPositionInput>
  }

  export type EmployeeUpdateWithWhereUniqueWithoutPositionInput = {
    where: EmployeeWhereUniqueInput
    data: XOR<EmployeeUpdateWithoutPositionInput, EmployeeUncheckedUpdateWithoutPositionInput>
  }

  export type EmployeeUpdateManyWithWhereWithoutPositionInput = {
    where: EmployeeScalarWhereInput
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyWithoutPositionInput>
  }

  export type DepartmentUpsertWithoutPositionsInput = {
    update: XOR<DepartmentUpdateWithoutPositionsInput, DepartmentUncheckedUpdateWithoutPositionsInput>
    create: XOR<DepartmentCreateWithoutPositionsInput, DepartmentUncheckedCreateWithoutPositionsInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutPositionsInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutPositionsInput, DepartmentUncheckedUpdateWithoutPositionsInput>
  }

  export type DepartmentUpdateWithoutPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUpdateManyWithoutDepartmentNestedInput
    parent?: DepartmentUpdateOneWithoutChildrenNestedInput
    children?: DepartmentUpdateManyWithoutParentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUncheckedUpdateManyWithoutDepartmentNestedInput
    children?: DepartmentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type DepartmentCreateWithoutEmployeesInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    positions?: PositionCreateNestedManyWithoutDepartmentInput
    parent?: DepartmentCreateNestedOneWithoutChildrenInput
    children?: DepartmentCreateNestedManyWithoutParentInput
  }

  export type DepartmentUncheckedCreateWithoutEmployeesInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    parentId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    positions?: PositionUncheckedCreateNestedManyWithoutDepartmentInput
    children?: DepartmentUncheckedCreateNestedManyWithoutParentInput
  }

  export type DepartmentCreateOrConnectWithoutEmployeesInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutEmployeesInput, DepartmentUncheckedCreateWithoutEmployeesInput>
  }

  export type PositionCreateWithoutEmployeesInput = {
    id?: string
    title: string
    code: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutPositionsInput
  }

  export type PositionUncheckedCreateWithoutEmployeesInput = {
    id?: string
    title: string
    code: string
    departmentId: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionCreateOrConnectWithoutEmployeesInput = {
    where: PositionWhereUniqueInput
    create: XOR<PositionCreateWithoutEmployeesInput, PositionUncheckedCreateWithoutEmployeesInput>
  }

  export type EmployeeCreateWithoutDirectReportsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutDirectReportsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutDirectReportsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutDirectReportsInput, EmployeeUncheckedCreateWithoutDirectReportsInput>
  }

  export type EmployeeCreateWithoutManagerInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutManagerInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutManagerInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutManagerInput, EmployeeUncheckedCreateWithoutManagerInput>
  }

  export type EmployeeCreateManyManagerInputEnvelope = {
    data: EmployeeCreateManyManagerInput | EmployeeCreateManyManagerInput[]
    skipDuplicates?: boolean
  }

  export type AttendanceCreateWithoutEmployeeInput = {
    id?: string
    date: Date | string
    clockIn?: Date | string | null
    clockOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    hoursWorked?: Decimal | DecimalJsLike | number | string | null
    overtime?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceUncheckedCreateWithoutEmployeeInput = {
    id?: string
    date: Date | string
    clockIn?: Date | string | null
    clockOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    hoursWorked?: Decimal | DecimalJsLike | number | string | null
    overtime?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceCreateOrConnectWithoutEmployeeInput = {
    where: AttendanceWhereUniqueInput
    create: XOR<AttendanceCreateWithoutEmployeeInput, AttendanceUncheckedCreateWithoutEmployeeInput>
  }

  export type AttendanceCreateManyEmployeeInputEnvelope = {
    data: AttendanceCreateManyEmployeeInput | AttendanceCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type ShiftAssignmentCreateWithoutEmployeeInput = {
    id?: string
    date: Date | string
    createdAt?: Date | string
    shift: ShiftCreateNestedOneWithoutAssignmentsInput
  }

  export type ShiftAssignmentUncheckedCreateWithoutEmployeeInput = {
    id?: string
    shiftId: string
    date: Date | string
    createdAt?: Date | string
  }

  export type ShiftAssignmentCreateOrConnectWithoutEmployeeInput = {
    where: ShiftAssignmentWhereUniqueInput
    create: XOR<ShiftAssignmentCreateWithoutEmployeeInput, ShiftAssignmentUncheckedCreateWithoutEmployeeInput>
  }

  export type ShiftAssignmentCreateManyEmployeeInputEnvelope = {
    data: ShiftAssignmentCreateManyEmployeeInput | ShiftAssignmentCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type LeaveRequestCreateWithoutEmployeeInput = {
    id?: string
    leaveType: $Enums.LeaveType
    startDate: Date | string
    endDate: Date | string
    days: number
    reason?: string | null
    status?: $Enums.LeaveStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaveRequestUncheckedCreateWithoutEmployeeInput = {
    id?: string
    leaveType: $Enums.LeaveType
    startDate: Date | string
    endDate: Date | string
    days: number
    reason?: string | null
    status?: $Enums.LeaveStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaveRequestCreateOrConnectWithoutEmployeeInput = {
    where: LeaveRequestWhereUniqueInput
    create: XOR<LeaveRequestCreateWithoutEmployeeInput, LeaveRequestUncheckedCreateWithoutEmployeeInput>
  }

  export type LeaveRequestCreateManyEmployeeInputEnvelope = {
    data: LeaveRequestCreateManyEmployeeInput | LeaveRequestCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type PayrollCreateWithoutEmployeeInput = {
    id?: string
    payPeriod: string
    baseSalary: Decimal | DecimalJsLike | number | string
    allowances?: Decimal | DecimalJsLike | number | string
    deductions?: Decimal | DecimalJsLike | number | string
    overtimePay?: Decimal | DecimalJsLike | number | string
    bonus?: Decimal | DecimalJsLike | number | string
    tax?: Decimal | DecimalJsLike | number | string
    netPay: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paidAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollUncheckedCreateWithoutEmployeeInput = {
    id?: string
    payPeriod: string
    baseSalary: Decimal | DecimalJsLike | number | string
    allowances?: Decimal | DecimalJsLike | number | string
    deductions?: Decimal | DecimalJsLike | number | string
    overtimePay?: Decimal | DecimalJsLike | number | string
    bonus?: Decimal | DecimalJsLike | number | string
    tax?: Decimal | DecimalJsLike | number | string
    netPay: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paidAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollCreateOrConnectWithoutEmployeeInput = {
    where: PayrollWhereUniqueInput
    create: XOR<PayrollCreateWithoutEmployeeInput, PayrollUncheckedCreateWithoutEmployeeInput>
  }

  export type PayrollCreateManyEmployeeInputEnvelope = {
    data: PayrollCreateManyEmployeeInput | PayrollCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type PerformanceReviewCreateWithoutEmployeeInput = {
    id?: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: string | null
    improvements?: string | null
    comments?: string | null
    nextReview?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerformanceReviewUncheckedCreateWithoutEmployeeInput = {
    id?: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: string | null
    improvements?: string | null
    comments?: string | null
    nextReview?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerformanceReviewCreateOrConnectWithoutEmployeeInput = {
    where: PerformanceReviewWhereUniqueInput
    create: XOR<PerformanceReviewCreateWithoutEmployeeInput, PerformanceReviewUncheckedCreateWithoutEmployeeInput>
  }

  export type PerformanceReviewCreateManyEmployeeInputEnvelope = {
    data: PerformanceReviewCreateManyEmployeeInput | PerformanceReviewCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type TrainingEnrollmentCreateWithoutEmployeeInput = {
    id?: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
    training: TrainingCreateNestedOneWithoutEnrollmentsInput
  }

  export type TrainingEnrollmentUncheckedCreateWithoutEmployeeInput = {
    id?: string
    trainingId: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
  }

  export type TrainingEnrollmentCreateOrConnectWithoutEmployeeInput = {
    where: TrainingEnrollmentWhereUniqueInput
    create: XOR<TrainingEnrollmentCreateWithoutEmployeeInput, TrainingEnrollmentUncheckedCreateWithoutEmployeeInput>
  }

  export type TrainingEnrollmentCreateManyEmployeeInputEnvelope = {
    data: TrainingEnrollmentCreateManyEmployeeInput | TrainingEnrollmentCreateManyEmployeeInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentUpsertWithoutEmployeesInput = {
    update: XOR<DepartmentUpdateWithoutEmployeesInput, DepartmentUncheckedUpdateWithoutEmployeesInput>
    create: XOR<DepartmentCreateWithoutEmployeesInput, DepartmentUncheckedCreateWithoutEmployeesInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutEmployeesInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutEmployeesInput, DepartmentUncheckedUpdateWithoutEmployeesInput>
  }

  export type DepartmentUpdateWithoutEmployeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    positions?: PositionUpdateManyWithoutDepartmentNestedInput
    parent?: DepartmentUpdateOneWithoutChildrenNestedInput
    children?: DepartmentUpdateManyWithoutParentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutEmployeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    positions?: PositionUncheckedUpdateManyWithoutDepartmentNestedInput
    children?: DepartmentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type PositionUpsertWithoutEmployeesInput = {
    update: XOR<PositionUpdateWithoutEmployeesInput, PositionUncheckedUpdateWithoutEmployeesInput>
    create: XOR<PositionCreateWithoutEmployeesInput, PositionUncheckedCreateWithoutEmployeesInput>
    where?: PositionWhereInput
  }

  export type PositionUpdateToOneWithWhereWithoutEmployeesInput = {
    where?: PositionWhereInput
    data: XOR<PositionUpdateWithoutEmployeesInput, PositionUncheckedUpdateWithoutEmployeesInput>
  }

  export type PositionUpdateWithoutEmployeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutPositionsNestedInput
  }

  export type PositionUncheckedUpdateWithoutEmployeesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    departmentId?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeUpsertWithoutDirectReportsInput = {
    update: XOR<EmployeeUpdateWithoutDirectReportsInput, EmployeeUncheckedUpdateWithoutDirectReportsInput>
    create: XOR<EmployeeCreateWithoutDirectReportsInput, EmployeeUncheckedCreateWithoutDirectReportsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutDirectReportsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutDirectReportsInput, EmployeeUncheckedUpdateWithoutDirectReportsInput>
  }

  export type EmployeeUpdateWithoutDirectReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutDirectReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUpsertWithWhereUniqueWithoutManagerInput = {
    where: EmployeeWhereUniqueInput
    update: XOR<EmployeeUpdateWithoutManagerInput, EmployeeUncheckedUpdateWithoutManagerInput>
    create: XOR<EmployeeCreateWithoutManagerInput, EmployeeUncheckedCreateWithoutManagerInput>
  }

  export type EmployeeUpdateWithWhereUniqueWithoutManagerInput = {
    where: EmployeeWhereUniqueInput
    data: XOR<EmployeeUpdateWithoutManagerInput, EmployeeUncheckedUpdateWithoutManagerInput>
  }

  export type EmployeeUpdateManyWithWhereWithoutManagerInput = {
    where: EmployeeScalarWhereInput
    data: XOR<EmployeeUpdateManyMutationInput, EmployeeUncheckedUpdateManyWithoutManagerInput>
  }

  export type AttendanceUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: AttendanceWhereUniqueInput
    update: XOR<AttendanceUpdateWithoutEmployeeInput, AttendanceUncheckedUpdateWithoutEmployeeInput>
    create: XOR<AttendanceCreateWithoutEmployeeInput, AttendanceUncheckedCreateWithoutEmployeeInput>
  }

  export type AttendanceUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: AttendanceWhereUniqueInput
    data: XOR<AttendanceUpdateWithoutEmployeeInput, AttendanceUncheckedUpdateWithoutEmployeeInput>
  }

  export type AttendanceUpdateManyWithWhereWithoutEmployeeInput = {
    where: AttendanceScalarWhereInput
    data: XOR<AttendanceUpdateManyMutationInput, AttendanceUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type AttendanceScalarWhereInput = {
    AND?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
    OR?: AttendanceScalarWhereInput[]
    NOT?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
    id?: StringFilter<"Attendance"> | string
    employeeId?: StringFilter<"Attendance"> | string
    date?: DateTimeFilter<"Attendance"> | Date | string
    clockIn?: DateTimeNullableFilter<"Attendance"> | Date | string | null
    clockOut?: DateTimeNullableFilter<"Attendance"> | Date | string | null
    status?: EnumAttendanceStatusFilter<"Attendance"> | $Enums.AttendanceStatus
    hoursWorked?: DecimalNullableFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    overtime?: DecimalNullableFilter<"Attendance"> | Decimal | DecimalJsLike | number | string | null
    notes?: StringNullableFilter<"Attendance"> | string | null
    createdAt?: DateTimeFilter<"Attendance"> | Date | string
    updatedAt?: DateTimeFilter<"Attendance"> | Date | string
  }

  export type ShiftAssignmentUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: ShiftAssignmentWhereUniqueInput
    update: XOR<ShiftAssignmentUpdateWithoutEmployeeInput, ShiftAssignmentUncheckedUpdateWithoutEmployeeInput>
    create: XOR<ShiftAssignmentCreateWithoutEmployeeInput, ShiftAssignmentUncheckedCreateWithoutEmployeeInput>
  }

  export type ShiftAssignmentUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: ShiftAssignmentWhereUniqueInput
    data: XOR<ShiftAssignmentUpdateWithoutEmployeeInput, ShiftAssignmentUncheckedUpdateWithoutEmployeeInput>
  }

  export type ShiftAssignmentUpdateManyWithWhereWithoutEmployeeInput = {
    where: ShiftAssignmentScalarWhereInput
    data: XOR<ShiftAssignmentUpdateManyMutationInput, ShiftAssignmentUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type ShiftAssignmentScalarWhereInput = {
    AND?: ShiftAssignmentScalarWhereInput | ShiftAssignmentScalarWhereInput[]
    OR?: ShiftAssignmentScalarWhereInput[]
    NOT?: ShiftAssignmentScalarWhereInput | ShiftAssignmentScalarWhereInput[]
    id?: StringFilter<"ShiftAssignment"> | string
    employeeId?: StringFilter<"ShiftAssignment"> | string
    shiftId?: StringFilter<"ShiftAssignment"> | string
    date?: DateTimeFilter<"ShiftAssignment"> | Date | string
    createdAt?: DateTimeFilter<"ShiftAssignment"> | Date | string
  }

  export type LeaveRequestUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: LeaveRequestWhereUniqueInput
    update: XOR<LeaveRequestUpdateWithoutEmployeeInput, LeaveRequestUncheckedUpdateWithoutEmployeeInput>
    create: XOR<LeaveRequestCreateWithoutEmployeeInput, LeaveRequestUncheckedCreateWithoutEmployeeInput>
  }

  export type LeaveRequestUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: LeaveRequestWhereUniqueInput
    data: XOR<LeaveRequestUpdateWithoutEmployeeInput, LeaveRequestUncheckedUpdateWithoutEmployeeInput>
  }

  export type LeaveRequestUpdateManyWithWhereWithoutEmployeeInput = {
    where: LeaveRequestScalarWhereInput
    data: XOR<LeaveRequestUpdateManyMutationInput, LeaveRequestUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type LeaveRequestScalarWhereInput = {
    AND?: LeaveRequestScalarWhereInput | LeaveRequestScalarWhereInput[]
    OR?: LeaveRequestScalarWhereInput[]
    NOT?: LeaveRequestScalarWhereInput | LeaveRequestScalarWhereInput[]
    id?: StringFilter<"LeaveRequest"> | string
    employeeId?: StringFilter<"LeaveRequest"> | string
    leaveType?: EnumLeaveTypeFilter<"LeaveRequest"> | $Enums.LeaveType
    startDate?: DateTimeFilter<"LeaveRequest"> | Date | string
    endDate?: DateTimeFilter<"LeaveRequest"> | Date | string
    days?: IntFilter<"LeaveRequest"> | number
    reason?: StringNullableFilter<"LeaveRequest"> | string | null
    status?: EnumLeaveStatusFilter<"LeaveRequest"> | $Enums.LeaveStatus
    approvedBy?: StringNullableFilter<"LeaveRequest"> | string | null
    approvedAt?: DateTimeNullableFilter<"LeaveRequest"> | Date | string | null
    rejectionReason?: StringNullableFilter<"LeaveRequest"> | string | null
    createdAt?: DateTimeFilter<"LeaveRequest"> | Date | string
    updatedAt?: DateTimeFilter<"LeaveRequest"> | Date | string
  }

  export type PayrollUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: PayrollWhereUniqueInput
    update: XOR<PayrollUpdateWithoutEmployeeInput, PayrollUncheckedUpdateWithoutEmployeeInput>
    create: XOR<PayrollCreateWithoutEmployeeInput, PayrollUncheckedCreateWithoutEmployeeInput>
  }

  export type PayrollUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: PayrollWhereUniqueInput
    data: XOR<PayrollUpdateWithoutEmployeeInput, PayrollUncheckedUpdateWithoutEmployeeInput>
  }

  export type PayrollUpdateManyWithWhereWithoutEmployeeInput = {
    where: PayrollScalarWhereInput
    data: XOR<PayrollUpdateManyMutationInput, PayrollUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type PayrollScalarWhereInput = {
    AND?: PayrollScalarWhereInput | PayrollScalarWhereInput[]
    OR?: PayrollScalarWhereInput[]
    NOT?: PayrollScalarWhereInput | PayrollScalarWhereInput[]
    id?: StringFilter<"Payroll"> | string
    employeeId?: StringFilter<"Payroll"> | string
    payPeriod?: StringFilter<"Payroll"> | string
    baseSalary?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    tax?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFilter<"Payroll"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFilter<"Payroll"> | $Enums.PayrollStatus
    paidAt?: DateTimeNullableFilter<"Payroll"> | Date | string | null
    notes?: StringNullableFilter<"Payroll"> | string | null
    createdAt?: DateTimeFilter<"Payroll"> | Date | string
    updatedAt?: DateTimeFilter<"Payroll"> | Date | string
  }

  export type PerformanceReviewUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: PerformanceReviewWhereUniqueInput
    update: XOR<PerformanceReviewUpdateWithoutEmployeeInput, PerformanceReviewUncheckedUpdateWithoutEmployeeInput>
    create: XOR<PerformanceReviewCreateWithoutEmployeeInput, PerformanceReviewUncheckedCreateWithoutEmployeeInput>
  }

  export type PerformanceReviewUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: PerformanceReviewWhereUniqueInput
    data: XOR<PerformanceReviewUpdateWithoutEmployeeInput, PerformanceReviewUncheckedUpdateWithoutEmployeeInput>
  }

  export type PerformanceReviewUpdateManyWithWhereWithoutEmployeeInput = {
    where: PerformanceReviewScalarWhereInput
    data: XOR<PerformanceReviewUpdateManyMutationInput, PerformanceReviewUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type PerformanceReviewScalarWhereInput = {
    AND?: PerformanceReviewScalarWhereInput | PerformanceReviewScalarWhereInput[]
    OR?: PerformanceReviewScalarWhereInput[]
    NOT?: PerformanceReviewScalarWhereInput | PerformanceReviewScalarWhereInput[]
    id?: StringFilter<"PerformanceReview"> | string
    employeeId?: StringFilter<"PerformanceReview"> | string
    reviewerId?: StringFilter<"PerformanceReview"> | string
    period?: StringFilter<"PerformanceReview"> | string
    rating?: EnumPerformanceRatingFilter<"PerformanceReview"> | $Enums.PerformanceRating
    goals?: JsonNullableFilter<"PerformanceReview">
    strengths?: StringNullableFilter<"PerformanceReview"> | string | null
    improvements?: StringNullableFilter<"PerformanceReview"> | string | null
    comments?: StringNullableFilter<"PerformanceReview"> | string | null
    nextReview?: DateTimeNullableFilter<"PerformanceReview"> | Date | string | null
    createdAt?: DateTimeFilter<"PerformanceReview"> | Date | string
    updatedAt?: DateTimeFilter<"PerformanceReview"> | Date | string
  }

  export type TrainingEnrollmentUpsertWithWhereUniqueWithoutEmployeeInput = {
    where: TrainingEnrollmentWhereUniqueInput
    update: XOR<TrainingEnrollmentUpdateWithoutEmployeeInput, TrainingEnrollmentUncheckedUpdateWithoutEmployeeInput>
    create: XOR<TrainingEnrollmentCreateWithoutEmployeeInput, TrainingEnrollmentUncheckedCreateWithoutEmployeeInput>
  }

  export type TrainingEnrollmentUpdateWithWhereUniqueWithoutEmployeeInput = {
    where: TrainingEnrollmentWhereUniqueInput
    data: XOR<TrainingEnrollmentUpdateWithoutEmployeeInput, TrainingEnrollmentUncheckedUpdateWithoutEmployeeInput>
  }

  export type TrainingEnrollmentUpdateManyWithWhereWithoutEmployeeInput = {
    where: TrainingEnrollmentScalarWhereInput
    data: XOR<TrainingEnrollmentUpdateManyMutationInput, TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeInput>
  }

  export type TrainingEnrollmentScalarWhereInput = {
    AND?: TrainingEnrollmentScalarWhereInput | TrainingEnrollmentScalarWhereInput[]
    OR?: TrainingEnrollmentScalarWhereInput[]
    NOT?: TrainingEnrollmentScalarWhereInput | TrainingEnrollmentScalarWhereInput[]
    id?: StringFilter<"TrainingEnrollment"> | string
    employeeId?: StringFilter<"TrainingEnrollment"> | string
    trainingId?: StringFilter<"TrainingEnrollment"> | string
    enrolledAt?: DateTimeFilter<"TrainingEnrollment"> | Date | string
    completedAt?: DateTimeNullableFilter<"TrainingEnrollment"> | Date | string | null
    score?: IntNullableFilter<"TrainingEnrollment"> | number | null
    certificate?: StringNullableFilter<"TrainingEnrollment"> | string | null
    status?: StringFilter<"TrainingEnrollment"> | string
  }

  export type EmployeeCreateWithoutAttendancesInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutAttendancesInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutAttendancesInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutAttendancesInput, EmployeeUncheckedCreateWithoutAttendancesInput>
  }

  export type EmployeeUpsertWithoutAttendancesInput = {
    update: XOR<EmployeeUpdateWithoutAttendancesInput, EmployeeUncheckedUpdateWithoutAttendancesInput>
    create: XOR<EmployeeCreateWithoutAttendancesInput, EmployeeUncheckedCreateWithoutAttendancesInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutAttendancesInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutAttendancesInput, EmployeeUncheckedUpdateWithoutAttendancesInput>
  }

  export type EmployeeUpdateWithoutAttendancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutAttendancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type ShiftAssignmentCreateWithoutShiftInput = {
    id?: string
    date: Date | string
    createdAt?: Date | string
    employee: EmployeeCreateNestedOneWithoutShiftAssignmentsInput
  }

  export type ShiftAssignmentUncheckedCreateWithoutShiftInput = {
    id?: string
    employeeId: string
    date: Date | string
    createdAt?: Date | string
  }

  export type ShiftAssignmentCreateOrConnectWithoutShiftInput = {
    where: ShiftAssignmentWhereUniqueInput
    create: XOR<ShiftAssignmentCreateWithoutShiftInput, ShiftAssignmentUncheckedCreateWithoutShiftInput>
  }

  export type ShiftAssignmentCreateManyShiftInputEnvelope = {
    data: ShiftAssignmentCreateManyShiftInput | ShiftAssignmentCreateManyShiftInput[]
    skipDuplicates?: boolean
  }

  export type ShiftAssignmentUpsertWithWhereUniqueWithoutShiftInput = {
    where: ShiftAssignmentWhereUniqueInput
    update: XOR<ShiftAssignmentUpdateWithoutShiftInput, ShiftAssignmentUncheckedUpdateWithoutShiftInput>
    create: XOR<ShiftAssignmentCreateWithoutShiftInput, ShiftAssignmentUncheckedCreateWithoutShiftInput>
  }

  export type ShiftAssignmentUpdateWithWhereUniqueWithoutShiftInput = {
    where: ShiftAssignmentWhereUniqueInput
    data: XOR<ShiftAssignmentUpdateWithoutShiftInput, ShiftAssignmentUncheckedUpdateWithoutShiftInput>
  }

  export type ShiftAssignmentUpdateManyWithWhereWithoutShiftInput = {
    where: ShiftAssignmentScalarWhereInput
    data: XOR<ShiftAssignmentUpdateManyMutationInput, ShiftAssignmentUncheckedUpdateManyWithoutShiftInput>
  }

  export type EmployeeCreateWithoutShiftAssignmentsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutShiftAssignmentsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutShiftAssignmentsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutShiftAssignmentsInput, EmployeeUncheckedCreateWithoutShiftAssignmentsInput>
  }

  export type ShiftCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    code: string
    startTime: string
    endTime: string
    breakMins?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShiftUncheckedCreateWithoutAssignmentsInput = {
    id?: string
    name: string
    code: string
    startTime: string
    endTime: string
    breakMins?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShiftCreateOrConnectWithoutAssignmentsInput = {
    where: ShiftWhereUniqueInput
    create: XOR<ShiftCreateWithoutAssignmentsInput, ShiftUncheckedCreateWithoutAssignmentsInput>
  }

  export type EmployeeUpsertWithoutShiftAssignmentsInput = {
    update: XOR<EmployeeUpdateWithoutShiftAssignmentsInput, EmployeeUncheckedUpdateWithoutShiftAssignmentsInput>
    create: XOR<EmployeeCreateWithoutShiftAssignmentsInput, EmployeeUncheckedCreateWithoutShiftAssignmentsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutShiftAssignmentsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutShiftAssignmentsInput, EmployeeUncheckedUpdateWithoutShiftAssignmentsInput>
  }

  export type EmployeeUpdateWithoutShiftAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutShiftAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type ShiftUpsertWithoutAssignmentsInput = {
    update: XOR<ShiftUpdateWithoutAssignmentsInput, ShiftUncheckedUpdateWithoutAssignmentsInput>
    create: XOR<ShiftCreateWithoutAssignmentsInput, ShiftUncheckedCreateWithoutAssignmentsInput>
    where?: ShiftWhereInput
  }

  export type ShiftUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: ShiftWhereInput
    data: XOR<ShiftUpdateWithoutAssignmentsInput, ShiftUncheckedUpdateWithoutAssignmentsInput>
  }

  export type ShiftUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftUncheckedUpdateWithoutAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    breakMins?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateWithoutLeaveRequestsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutLeaveRequestsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutLeaveRequestsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutLeaveRequestsInput, EmployeeUncheckedCreateWithoutLeaveRequestsInput>
  }

  export type EmployeeUpsertWithoutLeaveRequestsInput = {
    update: XOR<EmployeeUpdateWithoutLeaveRequestsInput, EmployeeUncheckedUpdateWithoutLeaveRequestsInput>
    create: XOR<EmployeeCreateWithoutLeaveRequestsInput, EmployeeUncheckedCreateWithoutLeaveRequestsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutLeaveRequestsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutLeaveRequestsInput, EmployeeUncheckedUpdateWithoutLeaveRequestsInput>
  }

  export type EmployeeUpdateWithoutLeaveRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutLeaveRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeCreateWithoutPayrollsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutPayrollsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutPayrollsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutPayrollsInput, EmployeeUncheckedCreateWithoutPayrollsInput>
  }

  export type EmployeeUpsertWithoutPayrollsInput = {
    update: XOR<EmployeeUpdateWithoutPayrollsInput, EmployeeUncheckedUpdateWithoutPayrollsInput>
    create: XOR<EmployeeCreateWithoutPayrollsInput, EmployeeUncheckedCreateWithoutPayrollsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutPayrollsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutPayrollsInput, EmployeeUncheckedUpdateWithoutPayrollsInput>
  }

  export type EmployeeUpdateWithoutPayrollsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutPayrollsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeCreateWithoutPerformancesInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutPerformancesInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    trainingEnrollments?: TrainingEnrollmentUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutPerformancesInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutPerformancesInput, EmployeeUncheckedCreateWithoutPerformancesInput>
  }

  export type EmployeeUpsertWithoutPerformancesInput = {
    update: XOR<EmployeeUpdateWithoutPerformancesInput, EmployeeUncheckedUpdateWithoutPerformancesInput>
    create: XOR<EmployeeCreateWithoutPerformancesInput, EmployeeUncheckedCreateWithoutPerformancesInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutPerformancesInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutPerformancesInput, EmployeeUncheckedUpdateWithoutPerformancesInput>
  }

  export type EmployeeUpdateWithoutPerformancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutPerformancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type TrainingEnrollmentCreateWithoutTrainingInput = {
    id?: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
    employee: EmployeeCreateNestedOneWithoutTrainingEnrollmentsInput
  }

  export type TrainingEnrollmentUncheckedCreateWithoutTrainingInput = {
    id?: string
    employeeId: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
  }

  export type TrainingEnrollmentCreateOrConnectWithoutTrainingInput = {
    where: TrainingEnrollmentWhereUniqueInput
    create: XOR<TrainingEnrollmentCreateWithoutTrainingInput, TrainingEnrollmentUncheckedCreateWithoutTrainingInput>
  }

  export type TrainingEnrollmentCreateManyTrainingInputEnvelope = {
    data: TrainingEnrollmentCreateManyTrainingInput | TrainingEnrollmentCreateManyTrainingInput[]
    skipDuplicates?: boolean
  }

  export type TrainingEnrollmentUpsertWithWhereUniqueWithoutTrainingInput = {
    where: TrainingEnrollmentWhereUniqueInput
    update: XOR<TrainingEnrollmentUpdateWithoutTrainingInput, TrainingEnrollmentUncheckedUpdateWithoutTrainingInput>
    create: XOR<TrainingEnrollmentCreateWithoutTrainingInput, TrainingEnrollmentUncheckedCreateWithoutTrainingInput>
  }

  export type TrainingEnrollmentUpdateWithWhereUniqueWithoutTrainingInput = {
    where: TrainingEnrollmentWhereUniqueInput
    data: XOR<TrainingEnrollmentUpdateWithoutTrainingInput, TrainingEnrollmentUncheckedUpdateWithoutTrainingInput>
  }

  export type TrainingEnrollmentUpdateManyWithWhereWithoutTrainingInput = {
    where: TrainingEnrollmentScalarWhereInput
    data: XOR<TrainingEnrollmentUpdateManyMutationInput, TrainingEnrollmentUncheckedUpdateManyWithoutTrainingInput>
  }

  export type EmployeeCreateWithoutTrainingEnrollmentsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutEmployeesInput
    position: PositionCreateNestedOneWithoutEmployeesInput
    manager?: EmployeeCreateNestedOneWithoutDirectReportsInput
    directReports?: EmployeeCreateNestedManyWithoutManagerInput
    attendances?: AttendanceCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeUncheckedCreateWithoutTrainingEnrollmentsInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    directReports?: EmployeeUncheckedCreateNestedManyWithoutManagerInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutEmployeeInput
    shiftAssignments?: ShiftAssignmentUncheckedCreateNestedManyWithoutEmployeeInput
    leaveRequests?: LeaveRequestUncheckedCreateNestedManyWithoutEmployeeInput
    payrolls?: PayrollUncheckedCreateNestedManyWithoutEmployeeInput
    performances?: PerformanceReviewUncheckedCreateNestedManyWithoutEmployeeInput
  }

  export type EmployeeCreateOrConnectWithoutTrainingEnrollmentsInput = {
    where: EmployeeWhereUniqueInput
    create: XOR<EmployeeCreateWithoutTrainingEnrollmentsInput, EmployeeUncheckedCreateWithoutTrainingEnrollmentsInput>
  }

  export type TrainingCreateWithoutEnrollmentsInput = {
    id?: string
    title: string
    code: string
    description?: string | null
    duration?: number | null
    provider?: string | null
    cost?: Decimal | DecimalJsLike | number | string | null
    maxEnroll?: number | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    status?: $Enums.TrainingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrainingUncheckedCreateWithoutEnrollmentsInput = {
    id?: string
    title: string
    code: string
    description?: string | null
    duration?: number | null
    provider?: string | null
    cost?: Decimal | DecimalJsLike | number | string | null
    maxEnroll?: number | null
    startDate?: Date | string | null
    endDate?: Date | string | null
    status?: $Enums.TrainingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrainingCreateOrConnectWithoutEnrollmentsInput = {
    where: TrainingWhereUniqueInput
    create: XOR<TrainingCreateWithoutEnrollmentsInput, TrainingUncheckedCreateWithoutEnrollmentsInput>
  }

  export type EmployeeUpsertWithoutTrainingEnrollmentsInput = {
    update: XOR<EmployeeUpdateWithoutTrainingEnrollmentsInput, EmployeeUncheckedUpdateWithoutTrainingEnrollmentsInput>
    create: XOR<EmployeeCreateWithoutTrainingEnrollmentsInput, EmployeeUncheckedCreateWithoutTrainingEnrollmentsInput>
    where?: EmployeeWhereInput
  }

  export type EmployeeUpdateToOneWithWhereWithoutTrainingEnrollmentsInput = {
    where?: EmployeeWhereInput
    data: XOR<EmployeeUpdateWithoutTrainingEnrollmentsInput, EmployeeUncheckedUpdateWithoutTrainingEnrollmentsInput>
  }

  export type EmployeeUpdateWithoutTrainingEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutTrainingEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type TrainingUpsertWithoutEnrollmentsInput = {
    update: XOR<TrainingUpdateWithoutEnrollmentsInput, TrainingUncheckedUpdateWithoutEnrollmentsInput>
    create: XOR<TrainingCreateWithoutEnrollmentsInput, TrainingUncheckedCreateWithoutEnrollmentsInput>
    where?: TrainingWhereInput
  }

  export type TrainingUpdateToOneWithWhereWithoutEnrollmentsInput = {
    where?: TrainingWhereInput
    data: XOR<TrainingUpdateWithoutEnrollmentsInput, TrainingUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type TrainingUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTrainingStatusFieldUpdateOperationsInput | $Enums.TrainingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainingUncheckedUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    provider?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxEnroll?: NullableIntFieldUpdateOperationsInput | number | null
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumTrainingStatusFieldUpdateOperationsInput | $Enums.TrainingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateManyDepartmentInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    positionId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PositionCreateManyDepartmentInput = {
    id?: string
    title: string
    code: string
    level?: number
    minSalary?: Decimal | DecimalJsLike | number | string | null
    maxSalary?: Decimal | DecimalJsLike | number | string | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentCreateManyParentInput = {
    id?: string
    name: string
    code: string
    type: $Enums.DepartmentType
    description?: string | null
    managerId?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmployeeUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateManyWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    positionId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PositionUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUpdateManyWithoutPositionNestedInput
  }

  export type PositionUncheckedUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type PositionUncheckedUpdateManyWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    minSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxSalary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUpdateManyWithoutDepartmentNestedInput
    positions?: PositionUpdateManyWithoutDepartmentNestedInput
    children?: DepartmentUpdateManyWithoutParentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employees?: EmployeeUncheckedUpdateManyWithoutDepartmentNestedInput
    positions?: PositionUncheckedUpdateManyWithoutDepartmentNestedInput
    children?: DepartmentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type DepartmentUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    type?: EnumDepartmentTypeFieldUpdateOperationsInput | $Enums.DepartmentType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateManyPositionInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    managerId?: string | null
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmployeeUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    manager?: EmployeeUpdateOneWithoutDirectReportsNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateManyWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    managerId?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmployeeCreateManyManagerInput = {
    id?: string
    employeeNumber: string
    tollgateUserId?: string | null
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    nrcNumber?: string | null
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    emergencyContact?: string | null
    emergencyPhone?: string | null
    departmentId: string
    positionId: string
    hireDate: Date | string
    salary: Decimal | DecimalJsLike | number | string
    status?: $Enums.EmployeeStatus
    terminationDate?: Date | string | null
    profilePhoto?: string | null
    notes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AttendanceCreateManyEmployeeInput = {
    id?: string
    date: Date | string
    clockIn?: Date | string | null
    clockOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    hoursWorked?: Decimal | DecimalJsLike | number | string | null
    overtime?: Decimal | DecimalJsLike | number | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShiftAssignmentCreateManyEmployeeInput = {
    id?: string
    shiftId: string
    date: Date | string
    createdAt?: Date | string
  }

  export type LeaveRequestCreateManyEmployeeInput = {
    id?: string
    leaveType: $Enums.LeaveType
    startDate: Date | string
    endDate: Date | string
    days: number
    reason?: string | null
    status?: $Enums.LeaveStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollCreateManyEmployeeInput = {
    id?: string
    payPeriod: string
    baseSalary: Decimal | DecimalJsLike | number | string
    allowances?: Decimal | DecimalJsLike | number | string
    deductions?: Decimal | DecimalJsLike | number | string
    overtimePay?: Decimal | DecimalJsLike | number | string
    bonus?: Decimal | DecimalJsLike | number | string
    tax?: Decimal | DecimalJsLike | number | string
    netPay: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paidAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerformanceReviewCreateManyEmployeeInput = {
    id?: string
    reviewerId: string
    period: string
    rating: $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: string | null
    improvements?: string | null
    comments?: string | null
    nextReview?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrainingEnrollmentCreateManyEmployeeInput = {
    id?: string
    trainingId: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
  }

  export type EmployeeUpdateWithoutManagerInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutEmployeesNestedInput
    position?: PositionUpdateOneRequiredWithoutEmployeesNestedInput
    directReports?: EmployeeUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateWithoutManagerInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    directReports?: EmployeeUncheckedUpdateManyWithoutManagerNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutEmployeeNestedInput
    shiftAssignments?: ShiftAssignmentUncheckedUpdateManyWithoutEmployeeNestedInput
    leaveRequests?: LeaveRequestUncheckedUpdateManyWithoutEmployeeNestedInput
    payrolls?: PayrollUncheckedUpdateManyWithoutEmployeeNestedInput
    performances?: PerformanceReviewUncheckedUpdateManyWithoutEmployeeNestedInput
    trainingEnrollments?: TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeNestedInput
  }

  export type EmployeeUncheckedUpdateManyWithoutManagerInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeNumber?: StringFieldUpdateOperationsInput | string
    tollgateUserId?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    nrcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: StringFieldUpdateOperationsInput | string
    positionId?: StringFieldUpdateOperationsInput | string
    hireDate?: DateTimeFieldUpdateOperationsInput | Date | string
    salary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumEmployeeStatusFieldUpdateOperationsInput | $Enums.EmployeeStatus
    terminationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    profilePhoto?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceUncheckedUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceUncheckedUpdateManyWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    clockIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clockOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    hoursWorked?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overtime?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftAssignmentUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    shift?: ShiftUpdateOneRequiredWithoutAssignmentsNestedInput
  }

  export type ShiftAssignmentUncheckedUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    shiftId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftAssignmentUncheckedUpdateManyWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    shiftId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaveRequestUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaveRequestUncheckedUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaveRequestUncheckedUpdateManyWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaveType?: EnumLeaveTypeFieldUpdateOperationsInput | $Enums.LeaveType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    days?: IntFieldUpdateOperationsInput | number
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLeaveStatusFieldUpdateOperationsInput | $Enums.LeaveStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollUncheckedUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollUncheckedUpdateManyWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    payPeriod?: StringFieldUpdateOperationsInput | string
    baseSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowances?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deductions?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    overtimePay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bonus?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netPay?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceReviewUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceReviewUncheckedUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerformanceReviewUncheckedUpdateManyWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    reviewerId?: StringFieldUpdateOperationsInput | string
    period?: StringFieldUpdateOperationsInput | string
    rating?: EnumPerformanceRatingFieldUpdateOperationsInput | $Enums.PerformanceRating
    goals?: NullableJsonNullValueInput | InputJsonValue
    strengths?: NullableStringFieldUpdateOperationsInput | string | null
    improvements?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    nextReview?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainingEnrollmentUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    training?: TrainingUpdateOneRequiredWithoutEnrollmentsNestedInput
  }

  export type TrainingEnrollmentUncheckedUpdateWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type TrainingEnrollmentUncheckedUpdateManyWithoutEmployeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    trainingId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ShiftAssignmentCreateManyShiftInput = {
    id?: string
    employeeId: string
    date: Date | string
    createdAt?: Date | string
  }

  export type ShiftAssignmentUpdateWithoutShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    employee?: EmployeeUpdateOneRequiredWithoutShiftAssignmentsNestedInput
  }

  export type ShiftAssignmentUncheckedUpdateWithoutShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShiftAssignmentUncheckedUpdateManyWithoutShiftInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrainingEnrollmentCreateManyTrainingInput = {
    id?: string
    employeeId: string
    enrolledAt?: Date | string
    completedAt?: Date | string | null
    score?: number | null
    certificate?: string | null
    status?: string
  }

  export type TrainingEnrollmentUpdateWithoutTrainingInput = {
    id?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    employee?: EmployeeUpdateOneRequiredWithoutTrainingEnrollmentsNestedInput
  }

  export type TrainingEnrollmentUncheckedUpdateWithoutTrainingInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type TrainingEnrollmentUncheckedUpdateManyWithoutTrainingInput = {
    id?: StringFieldUpdateOperationsInput | string
    employeeId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DepartmentCountOutputTypeDefaultArgs instead
     */
    export type DepartmentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DepartmentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PositionCountOutputTypeDefaultArgs instead
     */
    export type PositionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PositionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmployeeCountOutputTypeDefaultArgs instead
     */
    export type EmployeeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmployeeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShiftCountOutputTypeDefaultArgs instead
     */
    export type ShiftCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShiftCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrainingCountOutputTypeDefaultArgs instead
     */
    export type TrainingCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrainingCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HrUserDefaultArgs instead
     */
    export type HrUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HrUserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DepartmentDefaultArgs instead
     */
    export type DepartmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DepartmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PositionDefaultArgs instead
     */
    export type PositionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PositionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmployeeDefaultArgs instead
     */
    export type EmployeeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmployeeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AttendanceDefaultArgs instead
     */
    export type AttendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AttendanceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShiftDefaultArgs instead
     */
    export type ShiftArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShiftDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShiftAssignmentDefaultArgs instead
     */
    export type ShiftAssignmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShiftAssignmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LeaveRequestDefaultArgs instead
     */
    export type LeaveRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LeaveRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PayrollDefaultArgs instead
     */
    export type PayrollArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayrollDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PerformanceReviewDefaultArgs instead
     */
    export type PerformanceReviewArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PerformanceReviewDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrainingDefaultArgs instead
     */
    export type TrainingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrainingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TrainingEnrollmentDefaultArgs instead
     */
    export type TrainingEnrollmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TrainingEnrollmentDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}