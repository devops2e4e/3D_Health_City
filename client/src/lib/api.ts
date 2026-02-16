import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('token');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async login(email: string, password: string) {
        const { data } = await this.client.post('/auth/login', { email, password });
        return data.data;
    }

    async register(userData: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }) {
        const { data } = await this.client.post('/auth/register', userData);
        return data.data;
    }

    async getMe() {
        const { data } = await this.client.get('/auth/me');
        return data.data.user;
    }

    async updatePassword(currentPassword: string, newPassword: string) {
        const { data } = await this.client.put('/auth/password', {
            currentPassword,
            newPassword,
        });
        return data;
    }

    // Facility endpoints
    async getFacilities() {
        const { data } = await this.client.get('/facilities');
        return data.data.facilities;
    }

    async getFacility(id: string) {
        const { data } = await this.client.get(`/facilities/${id}`);
        return data.data.facility;
    }

    async createFacility(facilityData: any) {
        const { data } = await this.client.post('/facilities', facilityData);
        return data.data.facility;
    }

    async updateFacility(id: string, facilityData: any) {
        const { data } = await this.client.put(`/facilities/${id}`, facilityData);
        return data.data.facility;
    }

    async deleteFacility(id: string) {
        await this.client.delete(`/facilities/${id}`);
    }

    async getFacilitiesNearby(longitude: number, latitude: number, radius: number) {
        const { data } = await this.client.get('/facilities/nearby', {
            params: { longitude, latitude, radius },
        });
        return data.data.facilities;
    }

    async getFacilityHistory(id: string, startDate?: string, endDate?: string) {
        const { data } = await this.client.get(`/facilities/${id}/history`, {
            params: { startDate, endDate },
        });
        return data.data.history;
    }

    async getStatistics() {
        const { data } = await this.client.get('/facilities/statistics');
        return data.data.statistics;
    }

    // Intelligence endpoints
    async getCoverageAnalysis() {
        const { data } = await this.client.get('/intelligence/coverage');
        return data.data.analysis;
    }

    async getAlerts(limit?: number) {
        const { data } = await this.client.get('/intelligence/alerts', {
            params: { limit },
        });
        return data.data.alerts;
    }

    async generateAlerts() {
        const { data } = await this.client.post('/intelligence/alerts/generate');
        return data;
    }

    async acknowledgeAlert(id: string) {
        const { data } = await this.client.put(`/intelligence/alerts/${id}/acknowledge`);
        return data.data.alert;
    }

    // User endpoints
    async updateProfile(profileData: { name?: string; email?: string }) {
        const { data } = await this.client.put('/users/profile', profileData);
        return data.data.user;
    }

    async updatePreferences(preferences: any) {
        const { data } = await this.client.put('/users/preferences', preferences);
        return data.data.preferences;
    }
}

export const api = new ApiClient();
