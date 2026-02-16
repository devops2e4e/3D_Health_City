import { Facility, IFacility } from '../models/Facility';
import { Snapshot } from '../models/Snapshot';
import { AppError } from '../middlewares/errorHandler';

interface CreateFacilityDTO {
    name: string;
    type: 'Hospital' | 'Clinic' | 'Health Center' | 'Specialist Center';
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    capacity: number;
    currentLoad: number;
    status?: 'Active' | 'Under Maintenance' | 'Closed';
    services?: string[];
}

interface UpdateFacilityDTO {
    name?: string;
    type?: 'Hospital' | 'Clinic' | 'Health Center' | 'Specialist Center';
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    capacity?: number;
    currentLoad?: number;
    status?: 'Active' | 'Under Maintenance' | 'Closed';
    services?: string[];
}

export class FacilityService {
    /**
     * Get all facilities
     */
    static async getAllFacilities(): Promise<IFacility[]> {
        return await Facility.find().sort({ name: 1 });
    }

    /**
     * Get facility by ID
     */
    static async getFacilityById(id: string): Promise<IFacility> {
        const facility = await Facility.findById(id);

        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        return facility;
    }

    /**
     * Create new facility
     */
    static async createFacility(data: CreateFacilityDTO): Promise<IFacility> {
        const facility = await Facility.create(data);

        // Create initial snapshot
        await Snapshot.create({
            facilityId: facility._id,
            capacity: facility.capacity,
            currentLoad: facility.currentLoad,
            recordedAt: new Date(),
        });

        return facility;
    }

    /**
     * Update facility
     */
    static async updateFacility(
        id: string,
        data: UpdateFacilityDTO
    ): Promise<IFacility> {
        const facility = await Facility.findById(id);

        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        // Check if capacity or load changed
        const capacityChanged = data.capacity && data.capacity !== facility.capacity;
        const loadChanged = data.currentLoad !== undefined && data.currentLoad !== facility.currentLoad;

        // Update facility
        Object.assign(facility, data);
        facility.lastUpdated = new Date();
        await facility.save();

        // Create snapshot if capacity or load changed
        if (capacityChanged || loadChanged) {
            await Snapshot.create({
                facilityId: facility._id,
                capacity: facility.capacity,
                currentLoad: facility.currentLoad,
                recordedAt: new Date(),
            });
        }

        return facility;
    }

    /**
     * Delete facility
     */
    static async deleteFacility(id: string): Promise<void> {
        const facility = await Facility.findById(id);

        if (!facility) {
            throw new AppError('Facility not found', 404);
        }

        await Facility.findByIdAndDelete(id);

        // Delete associated snapshots
        await Snapshot.deleteMany({ facilityId: id });
    }

    /**
     * Get facilities within radius (geospatial query)
     */
    static async getFacilitiesNear(
        longitude: number,
        latitude: number,
        radiusKm: number
    ): Promise<IFacility[]> {
        return await Facility.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: radiusKm * 1000, // Convert km to meters
                },
            },
        });
    }

    /**
     * Get facility snapshots (historical data)
     */
    static async getFacilityHistory(
        facilityId: string,
        startDate?: Date,
        endDate?: Date
    ) {
        const query: any = { facilityId };

        if (startDate || endDate) {
            query.recordedAt = {};
            if (startDate) query.recordedAt.$gte = startDate;
            if (endDate) query.recordedAt.$lte = endDate;
        }

        return await Snapshot.find(query).sort({ recordedAt: -1 }).limit(100);
    }

    /**
     * Get system-wide statistics
     */
    static async getStatistics() {
        const facilities = await Facility.find();

        const totalFacilities = facilities.length;
        const overcapacityFacilities = facilities.filter(
            (f) => (f.currentLoad / f.capacity) * 100 > 85
        ).length;

        const avgLoadPercentage =
            facilities.reduce((sum, f) => sum + (f.currentLoad / f.capacity) * 100, 0) /
            totalFacilities;

        return {
            totalFacilities,
            overcapacityFacilities,
            avgLoadPercentage: Math.round(avgLoadPercentage),
            byType: {
                hospitals: facilities.filter((f) => f.type === 'Hospital').length,
                clinics: facilities.filter((f) => f.type === 'Clinic').length,
                healthCenters: facilities.filter((f) => f.type === 'Health Center').length,
                specialistCenters: facilities.filter((f) => f.type === 'Specialist Center').length,
            },
        };
    }
}
