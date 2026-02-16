import { create } from 'zustand';
import type { User, AuthResponse } from '../types';
import { api } from '../lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role?: string) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response: AuthResponse = await api.login(email, password);
            localStorage.setItem('token', response.token);
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const data = error.response?.data;
            const errorMessage = data?.message
                ?? (Array.isArray(data?.errors) ? data.errors.map((e: any) => e.msg || e.message).join(', ') : null)
                ?? error.response?.statusText
                ?? 'Login failed';

            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    register: async (name: string, email: string, password: string, role?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response: AuthResponse = await api.register({ name, email, password, role });
            localStorage.setItem('token', response.token);
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const data = error.response?.data;
            const errorMessage = data?.message
                ?? (Array.isArray(data?.errors) ? data.errors.map((e: any) => e.msg || e.message).join(', ') : null)
                ?? error.response?.statusText
                ?? 'Registration failed';

            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, isLoading: false });
            return;
        }

        set({ isLoading: true });
        try {
            const user = await api.getMe();
            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            localStorage.removeItem('token');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));
