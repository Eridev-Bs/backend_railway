import express from 'express';
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  sendQuotationEmail
} from '../controllers/quotationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createQuotation);
router.get('/', getQuotations);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', authorize('admin'), deleteQuotation);
router.post('/:id/send-email', sendQuotationEmail);

export default router;
