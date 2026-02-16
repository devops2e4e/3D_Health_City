import dotenv from 'dotenv';

dotenv.config();

interface Config {
    env: string;
    port: number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    allowedOrigins: string[];
    maxFileSize: number;
    uploadDir: string;
    defaultOvercapacityThreshold: number;
    defaultUnderservedRadiusKm: number;
    defaultCriticalThreshold: number;
}

const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsecity',
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    defaultOvercapacityThreshold: parseInt(process.env.DEFAULT_OVERCAPACITY_THRESHOLD || '85', 10),
    defaultUnderservedRadiusKm: parseInt(process.env.DEFAULT_UNDERSERVED_RADIUS_KM || '5', 10),
    defaultCriticalThreshold: parseInt(process.env.DEFAULT_CRITICAL_THRESHOLD || '95', 10),
};

// Validate critical config
if (config.env === 'production' && config.jwtSecret === 'change-this-secret') {
    throw new Error('JWT_SECRET must be set in production');
}

export default config;
