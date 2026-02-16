import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),

    body('role')
        .optional()
        .isIn(['Admin', 'Analyst', 'Viewer'])
        .withMessage('Invalid role'),
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const facilityValidation: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Facility name is required')
        .isLength({ max: 200 })
        .withMessage('Name cannot exceed 200 characters'),

    body('type')
        .notEmpty()
        .withMessage('Facility type is required')
        .isIn(['Hospital', 'Clinic', 'Health Center', 'Specialist Center'])
        .withMessage('Invalid facility type'),

    body('location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('Coordinates must be [longitude, latitude]'),

    body('location.coordinates[0]')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),

    body('location.coordinates[1]')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),

    body('capacity')
        .isInt({ min: 1 })
        .withMessage('Capacity must be at least 1'),

    body('currentLoad')
        .isInt({ min: 0 })
        .withMessage('Current load cannot be negative'),

    body('status')
        .optional()
        .isIn(['Active', 'Under Maintenance', 'Closed'])
        .withMessage('Invalid status'),

    body('services')
        .optional()
        .isArray()
        .withMessage('Services must be an array'),
];

export const updateFacilityValidation: ValidationChain[] = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Name must be between 1 and 200 characters'),

    body('type')
        .optional()
        .isIn(['Hospital', 'Clinic', 'Health Center', 'Specialist Center'])
        .withMessage('Invalid facility type'),

    body('location.coordinates')
        .optional()
        .isArray({ min: 2, max: 2 })
        .withMessage('Coordinates must be [longitude, latitude]'),

    body('location.coordinates[0]')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be between -180 and 180'),

    body('location.coordinates[1]')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be between -90 and 90'),

    body('capacity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Capacity must be at least 1'),

    body('currentLoad')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Current load cannot be negative'),

    body('status')
        .optional()
        .isIn(['Active', 'Under Maintenance', 'Closed'])
        .withMessage('Invalid status'),

    body('services')
        .optional()
        .isArray()
        .withMessage('Services must be an array'),
];

export const updatePreferencesValidation: ValidationChain[] = [
    body('theme')
        .optional()
        .isIn(['light', 'dark'])
        .withMessage('Invalid theme'),

    body('defaultView')
        .optional()
        .isIn(['3d', '2d'])
        .withMessage('Invalid default view'),

    body('alertThresholds.overcapacity')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Overcapacity threshold must be between 0 and 100'),

    body('alertThresholds.underservedRadius')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Underserved radius must be between 1 and 50'),

    body('alertThresholds.critical')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Critical threshold must be between 0 and 100'),
];
