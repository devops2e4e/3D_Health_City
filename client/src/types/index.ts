export interface User {
    id: string;
    name: string;
    email: string;
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
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: 'Admin' | 'Analyst' | 'Viewer';
}

export interface Facility {
    _id: string;
    name: string;
    type: 'Hospital' | 'Clinic' | 'Health Center' | 'Specialist Center';
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    capacity: number;
    currentLoad: number;
    status: 'Active' | 'Under Maintenance' | 'Closed';
    loadPercentage?: number;
    services: string[];
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
}

export interface Snapshot {
    _id: string;
    facilityId: string;
    capacity: number;
    currentLoad: number;
    recordedAt: string;
    createdAt: string;
}

export interface Alert {
    _id: string;
    facilityId: string | null;
    type: 'overcapacity' | 'underserved' | 'critical';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    metadata: {
        loadPercentage?: number;
        nearbyFacilities?: number;
        radius?: number;
    };
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
}

export interface Statistics {
    totalFacilities: number;
    overcapacityFacilities: number;
    avgLoadPercentage: number;
    byType: {
        hospitals: number;
        clinics: number;
        healthCenters: number;
        specialistCenters?: number;
    };
}

export interface CoverageAnalysis {
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
