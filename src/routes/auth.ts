import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth';
import { registerValidation, loginValidation } from '../validators';

const router = Router();

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);
router.put('/password', authenticate, AuthController.updatePassword);

export default router;
