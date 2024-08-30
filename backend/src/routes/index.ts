import { Router } from 'express';

import measurementRouter from './MeasurementRouter';

const router = Router();

router.use('/', measurementRouter);

export default router;