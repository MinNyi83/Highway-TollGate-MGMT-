import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export enum Permission {
  // User management
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_MANAGE_ROLES = 'user:manage-roles',

  // Account management
  ACCOUNT_CREATE = 'account:create',
  ACCOUNT_READ = 'account:read',
  ACCOUNT_UPDATE = 'account:update',
  ACCOUNT_DELETE = 'account:delete',
  ACCOUNT_MANAGE_BALANCE = 'account:manage-balance',

  // Vehicle management
  VEHICLE_CREATE = 'vehicle:create',
  VEHICLE_READ = 'vehicle:read',
  VEHICLE_UPDATE = 'vehicle:update',
  VEHICLE_DELETE = 'vehicle:delete',

  // Toll plaza management
  PLAZA_CREATE = 'plaza:create',
  PLAZA_READ = 'plaza:read',
  PLAZA_UPDATE = 'plaza:update',
  PLAZA_DELETE = 'plaza:delete',
  PLAZA_MANAGE_RATES = 'plaza:manage-rates',

  // Toll events
  EVENT_CREATE = 'event:create',
  EVENT_READ = 'event:read',
  EVENT_UPDATE = 'event:update',
  EVENT_DELETE = 'event:delete',

  // Transactions
  TRANSACTION_CREATE = 'transaction:create',
  TRANSACTION_READ = 'transaction:read',
  TRANSACTION_REFUND = 'transaction:refund',

  // Violations
  VIOLATION_READ = 'violation:read',
  VIOLATION_UPDATE = 'violation:update',
  VIOLATION_MANAGE = 'violation:manage',

  // Payments
  PAYMENT_PROCESS = 'payment:process',
  PAYMENT_REFUND = 'payment:refund',

  // Reports
  REPORT_VIEW = 'report:view',
  REPORT_EXPORT = 'report:export',

  // Devices
  DEVICE_READ = 'device:read',
  DEVICE_MANAGE = 'device:manage',

  // Notifications
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_SEND = 'notification:send',

  // Settings
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',

  // Audit logs
  AUDIT_READ = 'audit:read',

  // Fleet management
  FLEET_READ = 'fleet:read',
  FLEET_MANAGE = 'fleet:manage',

  // System
  SYSTEM_ADMIN = 'system:admin',
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
  CUSTOMER = 'CUSTOMER',
  ENTERPRISE_ADMIN = 'ENTERPRISE_ADMIN',
  ENTERPRISE_USER = 'ENTERPRISE_USER',
}

interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

const defaultRolePermissions: RolePermissions[] = [
  {
    role: Role.SUPER_ADMIN,
    permissions: Object.values(Permission),
  },
  {
    role: Role.ADMIN,
    permissions: [
      Permission.USER_CREATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_MANAGE_ROLES,
      Permission.ACCOUNT_CREATE,
      Permission.ACCOUNT_READ,
      Permission.ACCOUNT_UPDATE,
      Permission.ACCOUNT_MANAGE_BALANCE,
      Permission.VEHICLE_CREATE,
      Permission.VEHICLE_READ,
      Permission.VEHICLE_UPDATE,
      Permission.PLAZA_CREATE,
      Permission.PLAZA_READ,
      Permission.PLAZA_UPDATE,
      Permission.PLAZA_MANAGE_RATES,
      Permission.EVENT_READ,
      Permission.TRANSACTION_READ,
      Permission.TRANSACTION_REFUND,
      Permission.VIOLATION_READ,
      Permission.VIOLATION_UPDATE,
      Permission.VIOLATION_MANAGE,
      Permission.PAYMENT_PROCESS,
      Permission.PAYMENT_REFUND,
      Permission.REPORT_VIEW,
      Permission.REPORT_EXPORT,
      Permission.DEVICE_READ,
      Permission.DEVICE_MANAGE,
      Permission.NOTIFICATION_READ,
      Permission.NOTIFICATION_SEND,
      Permission.SETTINGS_READ,
      Permission.SETTINGS_UPDATE,
      Permission.AUDIT_READ,
      Permission.FLEET_READ,
      Permission.FLEET_MANAGE,
      Permission.SYSTEM_ADMIN,
    ],
  },
  {
    role: Role.MANAGER,
    permissions: [
      Permission.USER_READ,
      Permission.ACCOUNT_READ,
      Permission.ACCOUNT_UPDATE,
      Permission.VEHICLE_READ,
      Permission.VEHICLE_UPDATE,
      Permission.PLAZA_READ,
      Permission.PLAZA_UPDATE,
      Permission.EVENT_READ,
      Permission.TRANSACTION_READ,
      Permission.VIOLATION_READ,
      Permission.VIOLATION_UPDATE,
      Permission.REPORT_VIEW,
      Permission.REPORT_EXPORT,
      Permission.DEVICE_READ,
      Permission.NOTIFICATION_READ,
      Permission.NOTIFICATION_SEND,
      Permission.FLEET_READ,
      Permission.FLEET_MANAGE,
    ],
  },
  {
    role: Role.OPERATOR,
    permissions: [
      Permission.USER_READ,
      Permission.ACCOUNT_READ,
      Permission.VEHICLE_READ,
      Permission.PLAZA_READ,
      Permission.EVENT_CREATE,
      Permission.EVENT_READ,
      Permission.EVENT_UPDATE,
      Permission.TRANSACTION_READ,
      Permission.VIOLATION_READ,
      Permission.DEVICE_READ,
      Permission.NOTIFICATION_READ,
    ],
  },
  {
    role: Role.VIEWER,
    permissions: [
      Permission.USER_READ,
      Permission.ACCOUNT_READ,
      Permission.VEHICLE_READ,
      Permission.PLAZA_READ,
      Permission.EVENT_READ,
      Permission.TRANSACTION_READ,
      Permission.VIOLATION_READ,
      Permission.REPORT_VIEW,
      Permission.DEVICE_READ,
      Permission.NOTIFICATION_READ,
    ],
  },
  {
    role: Role.CUSTOMER,
    permissions: [
      Permission.ACCOUNT_READ,
      Permission.VEHICLE_CREATE,
      Permission.VEHICLE_READ,
      Permission.VEHICLE_UPDATE,
      Permission.TRANSACTION_READ,
      Permission.PAYMENT_PROCESS,
      Permission.NOTIFICATION_READ,
    ],
  },
  {
    role: Role.ENTERPRISE_ADMIN,
    permissions: [
      Permission.ACCOUNT_READ,
      Permission.ACCOUNT_MANAGE_BALANCE,
      Permission.VEHICLE_CREATE,
      Permission.VEHICLE_READ,
      Permission.VEHICLE_UPDATE,
      Permission.VEHICLE_DELETE,
      Permission.TRANSACTION_READ,
      Permission.PAYMENT_PROCESS,
      Permission.NOTIFICATION_READ,
      Permission.FLEET_READ,
      Permission.FLEET_MANAGE,
      Permission.REPORT_VIEW,
      Permission.REPORT_EXPORT,
    ],
  },
  {
    role: Role.ENTERPRISE_USER,
    permissions: [
      Permission.ACCOUNT_READ,
      Permission.VEHICLE_READ,
      Permission.TRANSACTION_READ,
      Permission.NOTIFICATION_READ,
      Permission.FLEET_READ,
    ],
  },
];

export class RBACService {
  private prisma: PrismaClient;
  private rolePermissions: Map<Role, Permission[]>;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.rolePermissions = new Map();

    // Initialize default role permissions
    defaultRolePermissions.forEach((rp) => {
      this.rolePermissions.set(rp.role, rp.permissions);
    });
  }

  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user) {
      return false;
    }

    // Check if user has the permission through their role
    const rolePermissions = this.rolePermissions.get(user.role as Role) || [];
    if (rolePermissions.includes(permission)) {
      return true;
    }

    // Check custom permissions (stored in user record)
    if (user.customPermissions) {
      const customPerms: Permission[] = JSON.parse(user.customPermissions);
      if (customPerms.includes(permission)) {
        return true;
      }
    }

    // Check if user is enterprise admin and has enterprise permissions
    if (user.customerType === 'ENTERPRISE') {
      const account = user.accounts[0];
      if (account && account.role === 'ADMIN') {
        const enterprisePerms = this.rolePermissions.get(Role.ENTERPRISE_ADMIN) || [];
        if (enterprisePerms.includes(permission)) {
          return true;
        }
      }
    }

    return false;
  }

  async hasAnyPermission(userId: string, permissions: Permission[]): Promise<boolean> {
    for (const permission of permissions) {
      if (await this.hasPermission(userId, permission)) {
        return true;
      }
    }
    return false;
  }

  async hasAllPermissions(userId: string, permissions: Permission[]): Promise<boolean> {
    for (const permission of permissions) {
      if (!(await this.hasPermission(userId, permission))) {
        return false;
      }
    }
    return true;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user) {
      return [];
    }

    const permissions = new Set<Permission>();

    // Add role permissions
    const rolePermissions = this.rolePermissions.get(user.role as Role) || [];
    rolePermissions.forEach((p) => permissions.add(p));

    // Add custom permissions
    if (user.customPermissions) {
      const customPerms: Permission[] = JSON.parse(user.customPermissions);
      customPerms.forEach((p) => permissions.add(p));
    }

    // Add enterprise permissions if applicable
    if (user.customerType === 'ENTERPRISE') {
      const account = user.accounts[0];
      if (account && account.role === 'ADMIN') {
        const enterprisePerms = this.rolePermissions.get(Role.ENTERPRISE_ADMIN) || [];
        enterprisePerms.forEach((p) => permissions.add(p));
      }
    }

    return Array.from(permissions);
  }

  async assignRole(userId: string, role: Role): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    logger.info(`Role ${role} assigned to user ${userId}`);
  }

  async addCustomPermission(userId: string, permission: Permission): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentPerms: Permission[] = user.customPermissions
      ? JSON.parse(user.customPermissions)
      : [];

    if (!currentPerms.includes(permission)) {
      currentPerms.push(permission);
      await this.prisma.user.update({
        where: { id: userId },
        data: { customPermissions: JSON.stringify(currentPerms) },
      });
    }
  }

  async removeCustomPermission(userId: string, permission: Permission): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const currentPerms: Permission[] = user.customPermissions
      ? JSON.parse(user.customPermissions)
      : [];

    const updatedPerms = currentPerms.filter((p) => p !== permission);
    await this.prisma.user.update({
      where: { id: userId },
      data: { customPermissions: JSON.stringify(updatedPerms) },
    });
  }

  getRolePermissions(role: Role): Permission[] {
    return this.rolePermissions.get(role) || [];
  }

  getAllRoles(): Role[] {
    return Object.values(Role);
  }
}
