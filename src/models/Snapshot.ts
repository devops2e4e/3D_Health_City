import { Schema, model, Document, Types } from 'mongoose';

export interface ISnapshot extends Document {
    facilityId: Types.ObjectId;
    capacity: number;
    currentLoad: number;
    recordedAt: Date;
    createdAt: Date;
}

const snapshotSchema = new Schema<ISnapshot>(
    {
        facilityId: {
            type: Schema.Types.ObjectId,
            ref: 'Facility',
            required: [true, 'Facility ID is required'],
            index: true,
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
        },
        currentLoad: {
            type: Number,
            required: [true, 'Current load is required'],
            min: [0, 'Current load cannot be negative'],
        },
        recordedAt: {
            type: Date,
            required: [true, 'Recorded date is required'],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient time-series queries
snapshotSchema.index({ facilityId: 1, recordedAt: -1 });

export const Snapshot = model<ISnapshot>('Snapshot', snapshotSchema);
