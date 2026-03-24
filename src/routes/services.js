import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('admin'), createService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.put('/:id', authorize('admin'), updateService);
router.delete('/:id', authorize('admin'), deleteService);

export default router;
