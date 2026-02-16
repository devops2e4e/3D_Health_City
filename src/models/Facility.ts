import { Schema, model, Document } from 'mongoose';

// GeoJSON Point interface
interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface IFacility extends Document {
    name: string;
    type: 'Hospital' | 'Clinic' | 'Health Center' | 'Specialist Center';
    location: GeoJSONPoint;
    capacity: number;
    currentLoad: number;
    status: 'Active' | 'Under Maintenance' | 'Closed';
    services: string[];
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}

const facilitySchema = new Schema<IFacility>(
    {
        name: {
            type: String,
            required: [true, 'Facility name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        type: {
            type: String,
            enum: ['Hospital', 'Clinic', 'Health Center', 'Specialist Center'],
            required: [true, 'Facility type is required'],
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: function (coords: number[]) {
                        return (
                            coords.length === 2 &&
                            coords[0] >= -180 &&
                            coords[0] <= 180 &&
                            coords[1] >= -90 &&
                            coords[1] <= 90
                        );
                    },
                    message: 'Invalid coordinates',
                },
            },
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
        status: {
            type: String,
            enum: ['Active', 'Under Maintenance', 'Closed'],
            default: 'Active',
        },
        services: {
            type: [String],
            default: [],
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Geospatial index for location-based queries
facilitySchema.index({ location: '2dsphere' });

// Index for faster type filtering
facilitySchema.index({ type: 1 });

// Virtual for load percentage
facilitySchema.virtual('loadPercentage').get(function () {
    return Math.round((this.currentLoad / this.capacity) * 100);
});

// Ensure virtuals are included in JSON
facilitySchema.set('toJSON', { virtuals: true });
facilitySchema.set('toObject', { virtuals: true });

export const Facility = model<IFacility>('Facility', facilitySchema);
