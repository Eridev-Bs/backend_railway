import express from 'express';
import {
  getDashboard,
  getQuotationsByPeriod,
  getTopServices
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/quotations-by-period', getQuotationsByPeriod);
router.get('/top-services', getTopServices);

export default router;
