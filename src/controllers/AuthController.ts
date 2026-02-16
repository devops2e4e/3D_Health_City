import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';

export class AuthController {
    /**
     * Register new user
     */
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await AuthService.register(req.body);

            return res.status(201).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login user
     */
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await AuthService.login(req.body);

            return res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    /**
     * Get current user
     */
    static async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: req.user!._id.toString(),
                        name: req.user!.name,
                        email: req.user!.email,
                        role: req.user!.role,
                        preferences: req.user!.preferences,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update password
     */
    static async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { currentPassword, newPassword } = req.body;

            await AuthService.updatePassword(
                req.user!._id.toString(),
                currentPassword,
                newPassword
            );

            res.status(200).json({
                status: 'success',
                message: 'Password updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }
}
