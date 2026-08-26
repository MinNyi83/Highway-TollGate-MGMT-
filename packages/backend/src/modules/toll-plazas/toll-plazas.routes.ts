import { Router, Request, Response } from 'express';
import {
  getTollPlazas,
  getTollPlazaById,
  createTollPlaza,
  updateTollPlaza,
  getTollRates,
  createTollRate,
} from './toll-plazas.service';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const plazas = await getTollPlazas();
    res.json(plazas);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const plaza = await getTollPlazaById(req.params.id);
    if (!plaza) {
      res.status(404).json({ error: 'Toll plaza not found' });
      return;
    }
    res.json(plaza);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, gateCode, locationLat, locationLng, mileMarker, lanes } = req.body;

    if (!name || locationLat === undefined || locationLng === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const plaza = await createTollPlaza({ name, gateCode, locationLat, locationLng, mileMarker, lanes });
    res.status(201).json(plaza);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const plaza = await updateTollPlaza(req.params.id, req.body);
    res.json(plaza);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/rates', authMiddleware, async (req: Request, res: Response) => {
  try {
    const rates = await getTollRates(req.params.id);
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/rates', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { vehicleClass, rateAmount, effectiveFrom, effectiveTo } = req.body;

    if (!vehicleClass || !rateAmount || !effectiveFrom) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const rate = await createTollRate(req.params.id, {
      vehicleClass,
      rateAmount,
      effectiveFrom: new Date(effectiveFrom),
      effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
    });

    res.status(201).json(rate);
  } catch (error) {
    if (error instanceof Error && error.message === 'Toll plaza not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
