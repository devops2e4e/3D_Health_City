import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { updatePreferencesValidation } from '../validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.put('/profile', UserController.updateProfile);
router.put(
    '/preferences',
    updatePreferencesValidation,
    UserController.updatePreferences
);

export default router;
