import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { AppError } from '../middlewares/errorHandler';

export class UserController {
    /**
     * Update profile
     */
    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email } = req.body;

            const user = await User.findById(req.user!._id);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            if (name) user.name = name;
            if (email) user.email = email;

            await user.save();

            return res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        preferences: user.preferences,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update preferences
     */
    static async updatePreferences(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await User.findById(req.user!._id);

            if (!user) {
                throw new AppError('User not found', 404);
            }

            // Update preferences
            if (req.body.theme) user.preferences.theme = req.body.theme;
            if (req.body.defaultView) user.preferences.defaultView = req.body.defaultView;

            if (req.body.alertThresholds) {
                if (req.body.alertThresholds.overcapacity !== undefined) {
                    user.preferences.alertThresholds.overcapacity = req.body.alertThresholds.overcapacity;
                }
                if (req.body.alertThresholds.underservedRadius !== undefined) {
                    user.preferences.alertThresholds.underservedRadius = req.body.alertThresholds.underservedRadius;
                }
                if (req.body.alertThresholds.critical !== undefined) {
                    user.preferences.alertThresholds.critical = req.body.alertThresholds.critical;
                }
            }

            user.markModified('preferences');
            await user.save();

            res.status(200).json({
                status: 'success',
                data: {
                    preferences: user.preferences,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
