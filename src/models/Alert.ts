import { Schema, model, Document, Types } from 'mongoose';

export interface IAlert extends Document {
    facilityId: Types.ObjectId | null;
    type: 'overcapacity' | 'underserved' | 'critical';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    metadata: {
        loadPercentage?: number;
        nearbyFacilities?: number;
        radius?: number;
    };
    timestamp: Date;
    acknowledged: boolean;
    acknowledgedBy?: Types.ObjectId;
    acknowledgedAt?: Date;
    createdAt: Date;
}

const alertSchema = new Schema<IAlert>(
    {
        facilityId: {
            type: Schema.Types.ObjectId,
            ref: 'Facility',
            required: false,
            default: null,
            index: true,
        },
        type: {
            type: String,
            enum: ['overcapacity', 'underserved', 'critical'],
            required: [true, 'Alert type is required'],
        },
        message: {
            type: String,
            required: [true, 'Alert message is required'],
            maxlength: [500, 'Message cannot exceed 500 characters'],
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            required: [true, 'Severity is required'],
        },
        metadata: {
            loadPercentage: Number,
            nearbyFacilities: Number,
            radius: Number,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
        acknowledged: {
            type: Boolean,
            default: false,
        },
        acknowledgedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        acknowledgedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
alertSchema.index({ facilityId: 1, timestamp: -1 });
alertSchema.index({ type: 1, acknowledged: 1 });

export const Alert = model<IAlert>('Alert', alertSchema);
