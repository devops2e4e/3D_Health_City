import { Router } from 'express';
import { FacilityController } from '../controllers/FacilityController';
import { authenticate, authorize } from '../middlewares/auth';
import { facilityValidation, updateFacilityValidation } from '../validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Specific paths first (before /:id)
router.get('/', FacilityController.getAll);
router.get('/statistics', FacilityController.getStatistics);
router.get('/nearby', FacilityController.getNearby);
router.get('/:id/history', FacilityController.getHistory);
router.get('/:id', FacilityController.getById);

// Admin/Analyst only routes
router.post(
    '/',
    authorize('Admin', 'Analyst'),
    facilityValidation,
    FacilityController.create
);

router.put(
    '/:id',
    authorize('Admin', 'Analyst'),
    updateFacilityValidation,
    FacilityController.update
);

router.delete(
    '/:id',
    authorize('Admin'),
    FacilityController.delete
);

export default router;
