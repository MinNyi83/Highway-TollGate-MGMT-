import { Router, Request, Response } from 'express';
import {
  getViolations,
  getViolationById,
  updateViolationStatus,
} from './violations.service';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const violations = await getViolations();
    res.json(violations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const violation = await getViolationById(req.params.id);
    if (!violation) {
      res.status(404).json({ error: 'Violation not found' });
      return;
    }
    res.json(violation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    const violation = await updateViolationStatus(req.params.id, status);
    res.json(violation);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
