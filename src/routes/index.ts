import { Router } from 'express';
import authRoutes from './auth';
import facilityRoutes from './facilities';
import intelligenceRoutes from './intelligence';
import userRoutes from './users';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/facilities', facilityRoutes);
router.use('/intelligence', intelligenceRoutes);
router.use('/users', userRoutes);

// Health check
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'PulseCity API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
