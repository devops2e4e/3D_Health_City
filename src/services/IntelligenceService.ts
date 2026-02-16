import { Facility } from '../models/Facility';
import { Alert } from '../models/Alert';
import { IUser } from '../models/User';

interface CoverageAnalysis {
    underservedZones: Array<{
        location: [number, number];
        nearbyFacilities: number;
        radius: number;
    }>;
    overcapacityFacilities: Array<{
        facilityId: string;
        name: string;
        loadPercentage: number;
    }>;
    criticalFacilities: Array<{
        facilityId: string;
        name: string;
        loadPercentage: number;
    }>;
}

export class IntelligenceService {
    /**
     * Calculate coverage and detect issues
     */
    static async analyzeCoverage(user: IUser): Promise<CoverageAnalysis> {
        const facilities = await Facility.find();
        if (facilities.length === 0) {
            return {
                underservedZones: [],
                overcapacityFacilities: [],
                criticalFacilities: [],
            };
        }
        const thresholds = user.preferences.alertThresholds;

        const overcapacityFacilities = [];
        const criticalFacilities = [];

        // Analyze each facility
        for (const facility of facilities) {
            const loadPercentage = (facility.currentLoad / facility.capacity) * 100;

            if (loadPercentage >= thresholds.critical) {
                criticalFacilities.push({
                    facilityId: facility._id.toString(),
                    name: facility.name,
                    loadPercentage: Math.round(loadPercentage),
                });
            } else if (loadPercentage >= thresholds.overcapacity) {
                overcapacityFacilities.push({
                    facilityId: facility._id.toString(),
                    name: facility.name,
                    loadPercentage: Math.round(loadPercentage),
                });
            }
        }

        // Detect underserved zones (simplified - would need population data in production)
        const underservedZones = await this.detectUnderservedZones(
            facilities,
            thresholds.underservedRadius
        );

        return {
            underservedZones,
            overcapacityFacilities,
            criticalFacilities,
        };
    }

    /**
     * Detect underserved zones
     */
    private static async detectUnderservedZones(
        facilities: any[],
        radiusKm: number
    ) {
        const underservedZones: any[] = [];

        // Grid-based sampling (simplified approach)
        // In production, this would use actual population density data
        const gridSize = 0.1; // degrees
        const bounds = this.calculateBounds(facilities);

        for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += gridSize) {
            for (let lng = bounds.minLng; lng <= bounds.maxLng; lng += gridSize) {
                const nearbyFacilities = facilities.filter((f) => {
                    const distance = this.calculateDistance(
                        lat,
                        lng,
                        f.location.coordinates[1],
                        f.location.coordinates[0]
                    );
                    return distance <= radiusKm;
                });

                if (nearbyFacilities.length === 0) {
                    underservedZones.push({
                        location: [lng, lat],
                        nearbyFacilities: 0,
                        radius: radiusKm,
                    });
                }
            }
        }

        return underservedZones;
    }

    /**
     * Calculate geographic bounds
     */
    private static calculateBounds(facilities: any[]) {
        const lats = facilities.map((f) => f.location.coordinates[1]);
        const lngs = facilities.map((f) => f.location.coordinates[0]);

        return {
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs),
        };
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    private static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) *
            Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Generate alerts based on analysis
     */
    static async generateAlerts(user: IUser): Promise<void> {
        const analysis = await this.analyzeCoverage(user);
        if (
            analysis.overcapacityFacilities.length === 0 &&
            analysis.criticalFacilities.length === 0 &&
            analysis.underservedZones.length === 0
        ) {
            return;
        }

        // Generate overcapacity alerts
        for (const facility of analysis.overcapacityFacilities) {
            const existingAlert = await Alert.findOne({
                facilityId: facility.facilityId,
                type: 'overcapacity',
                acknowledged: false,
            });

            if (!existingAlert) {
                await Alert.create({
                    facilityId: facility.facilityId,
                    type: 'overcapacity',
                    message: `${facility.name} is at ${facility.loadPercentage}% capacity`,
                    severity: 'high',
                    metadata: {
                        loadPercentage: facility.loadPercentage,
                    },
                });
            }
        }

        // Generate critical alerts
        for (const facility of analysis.criticalFacilities) {
            const existingAlert = await Alert.findOne({
                facilityId: facility.facilityId,
                type: 'critical',
                acknowledged: false,
            });

            if (!existingAlert) {
                await Alert.create({
                    facilityId: facility.facilityId,
                    type: 'critical',
                    message: `${facility.name} is at CRITICAL capacity (${facility.loadPercentage}%)`,
                    severity: 'critical',
                    metadata: {
                        loadPercentage: facility.loadPercentage,
                    },
                });
            }
        }

        // Generate underserved zone alerts (limited to prevent spam)
        const limitedUnderserved = analysis.underservedZones.slice(0, 10);
        for (const zone of limitedUnderserved) {
            await Alert.create({
                facilityId: null,
                type: 'underserved',
                message: `Underserved zone detected at [${zone.location[1].toFixed(2)}, ${zone.location[0].toFixed(2)}]`,
                severity: 'medium',
                metadata: {
                    nearbyFacilities: zone.nearbyFacilities,
                    radius: zone.radius,
                },
            });
        }
    }

    /**
     * Get recent alerts
     */
    static async getRecentAlerts(limit: number = 50) {
        return await Alert.find()
            .populate('facilityId', 'name type')
            .sort({ timestamp: -1 })
            .limit(limit);
    }

    /**
     * Acknowledge alert
     */
    static async acknowledgeAlert(alertId: string, userId: string) {
        const alert = await Alert.findById(alertId);

        if (!alert) {
            throw new Error('Alert not found');
        }

        alert.acknowledged = true;
        alert.acknowledgedBy = userId as any;
        alert.acknowledgedAt = new Date();
        await alert.save();

        return alert;
    }
}
