import { Router, Request, Response } from 'express';
import {
  createEntryEvent,
  completeExitEvent,
  getTollEvents,
  getTollEventById,
} from './toll-events.service';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const events = await getTollEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const event = await getTollEventById(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Toll event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/entry', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { vehicleId, plazaId, rfidTagId, anprPlate, laneNumber, direction, amount } = req.body;

    if (!vehicleId || !plazaId) {
      res.status(400).json({ error: 'vehicleId and plazaId are required' });
      return;
    }

    const event = await createEntryEvent({ vehicleId, plazaId, rfidTagId, anprPlate, laneNumber, direction, amount });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/exit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { anprPlate } = req.body;

    const event = await completeExitEvent({
      eventId: req.params.id,
      anprPlate,
    });

    res.json(event);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
