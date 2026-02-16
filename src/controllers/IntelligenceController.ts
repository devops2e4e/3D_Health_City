import { Request, Response, NextFunction } from 'express';
import { IntelligenceService } from '../services/IntelligenceService';

export class IntelligenceController {
    /**
     * Analyze coverage
     */
    static async analyzeCoverage(req: Request, res: Response, next: NextFunction) {
        try {
            const analysis = await IntelligenceService.analyzeCoverage(req.user!);

            res.status(200).json({
                status: 'success',
                data: { analysis },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate alerts
     */
    static async generateAlerts(req: Request, res: Response, next: NextFunction) {
        try {
            await IntelligenceService.generateAlerts(req.user!);

            res.status(200).json({
                status: 'success',
                message: 'Alerts generated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get recent alerts
     */
    static async getAlerts(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const alerts = await IntelligenceService.getRecentAlerts(limit);

            res.status(200).json({
                status: 'success',
                results: alerts.length,
                data: { alerts },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Acknowledge alert
     */
    static async acknowledgeAlert(req: Request, res: Response, next: NextFunction) {
        try {
            const alert = await IntelligenceService.acknowledgeAlert(
                req.params.id,
                req.user!._id.toString()
            );

            res.status(200).json({
                status: 'success',
                data: { alert },
            });
        } catch (error) {
            next(error);
        }
    }
}
