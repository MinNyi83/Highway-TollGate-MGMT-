import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function auditLog(action: string, entity: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode < 400 && req.user) {
        prisma.auditLog.create({
          data: {
            userId: req.user.userId,
            action,
            entity,
            entityId: req.params.id || body?.id,
            details: { method: req.method, path: req.path },
            ipAddress: req.ip,
          },
        }).catch(console.error);
      }
      return originalJson(body);
    };
    next();
  };
}
