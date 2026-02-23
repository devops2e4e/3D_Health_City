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

import { Facility } from '../models/Facility';

// Health check
router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'PulseCity API is running',
        timestamp: new Date().toISOString(),
    });
});

// Diagnostic DB check
router.get('/health/db', async (_req, res) => {
    try {
        const count = await Facility.countDocuments();
        res.status(200).json({
            status: 'success',
            database: 'connected',
            facilitiesCount: count,
            env: process.env.NODE_ENV
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;
