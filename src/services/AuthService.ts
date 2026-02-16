import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import config from '../config';
import { AppError } from '../middlewares/errorHandler';

interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    role?: 'Admin' | 'Analyst' | 'Viewer';
}

interface LoginDTO {
    email: string;
    password: string;
}

interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        preferences: IUser['preferences'];
    };
    token: string;
}

export class AuthService {
    /**
     * Register a new user
     */
    static async register(data: RegisterDTO): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError('Email already registered', 409);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Create user
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || 'Viewer',
        });

        // Generate token
        const token = this.generateToken(user);

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                preferences: user.preferences,
            },
            token,
        };
    }

    /**
     * Login user
     */
    static async login(data: LoginDTO): Promise<AuthResponse> {
        // Find user with password field
        const user = await User.findOne({ email: data.email }).select('+password');

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        // Generate token
        const token = this.generateToken(user);

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                preferences: user.preferences,
            },
            token,
        };
    }

    /**
     * Generate JWT token
     */
    private static generateToken(user: IUser): string {
        return jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            config.jwtSecret as jwt.Secret,
            {
                expiresIn: config.jwtExpiresIn as any,
            }
        );
    }

    /**
     * Update user password
     */
    static async updatePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await User.findById(userId).select('+password');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect', 401);
        }

        // Hash and update new password
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
    }
}
