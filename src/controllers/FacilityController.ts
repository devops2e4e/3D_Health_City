import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { FacilityService } from '../services/FacilityService';

export class FacilityController {
    /**
     * Get all facilities
     */
    static async getAll(_req: Request, res: Response, next: NextFunction) {
        try {
            const facilities = await FacilityService.getAllFacilities();

            return res.status(200).json({
                status: 'success',
                results: facilities.length,
                data: { facilities },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get facility by ID
     */
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const facility = await FacilityService.getFacilityById(req.params.id);

            res.status(200).json({
                status: 'success',
                data: { facility },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create facility
     */
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const facility = await FacilityService.createFacility(req.body);

            return res.status(201).json({
                status: 'success',
                data: { facility },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update facility
     */
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const facility = await FacilityService.updateFacility(
                req.params.id,
                req.body
            );

            res.status(200).json({
                status: 'success',
                data: { facility },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete facility
     */
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await FacilityService.deleteFacility(req.params.id);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get facilities near location
     */
    static async getNearby(req: Request, res: Response, next: NextFunction) {
        try {
            const { longitude, latitude, radius } = req.query;

            const facilities = await FacilityService.getFacilitiesNear(
                parseFloat(longitude as string),
                parseFloat(latitude as string),
                parseFloat(radius as string)
            );

            res.status(200).json({
                status: 'success',
                results: facilities.length,
                data: { facilities },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get facility history
     */
    static async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { startDate, endDate } = req.query;

            const history = await FacilityService.getFacilityHistory(
                req.params.id,
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined
            );

            res.status(200).json({
                status: 'success',
                results: history.length,
                data: { history },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get statistics
     */
    static async getStatistics(_req: Request, res: Response, next: NextFunction) {
        try {
            const statistics = await FacilityService.getStatistics();

            return res.status(200).json({
                status: 'success',
                data: { statistics },
            });
        } catch (error) {
            next(error);
        }
    }
}
