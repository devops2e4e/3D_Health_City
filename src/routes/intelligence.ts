import { Router } from 'express';
import { IntelligenceController } from '../controllers/IntelligenceController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/coverage', IntelligenceController.analyzeCoverage);
router.get('/alerts', IntelligenceController.getAlerts);
router.put('/alerts/:id/acknowledge', IntelligenceController.acknowledgeAlert);

// Admin/Analyst only
router.post(
    '/alerts/generate',
    authorize('Admin', 'Analyst'),
    IntelligenceController.generateAlerts
);

export default router;
