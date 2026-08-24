import { Router, Request, Response } from 'express';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
} from './notifications.service';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const notifications = await getNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const notification = await getNotificationById(req.params.id);
    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const notification = await createNotification({ userId, type, message });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const notification = await markAsRead(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/read-all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
