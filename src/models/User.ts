import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'Admin' | 'Analyst' | 'Viewer';
    preferences: {
        theme: 'light' | 'dark';
        defaultView: '3d' | '2d';
        alertThresholds: {
            overcapacity: number;
            underservedRadius: number;
            critical: number;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ['Admin', 'Analyst', 'Viewer'],
            default: 'Viewer',
        },
        preferences: {
            theme: {
                type: String,
                enum: ['light', 'dark'],
                default: 'light',
            },
            defaultView: {
                type: String,
                enum: ['3d', '2d'],
                default: '3d',
            },
            alertThresholds: {
                overcapacity: {
                    type: Number,
                    default: 85,
                    min: 0,
                    max: 100,
                },
                underservedRadius: {
                    type: Number,
                    default: 5,
                    min: 1,
                    max: 50,
                },
                critical: {
                    type: Number,
                    default: 95,
                    min: 0,
                    max: 100,
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

// Timestamps are handled by the schema option below

export const User = model<IUser>('User', userSchema);
