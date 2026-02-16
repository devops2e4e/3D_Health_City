import { type ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'Admin' | 'Analyst' | 'Viewer';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user, loadUser } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
                        <div className="absolute inset-0 rounded-full border-2 border-t-neon-blue animate-spin" />
                    </div>
                    <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Verifying Identity...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && user) {
        const roleHierarchy = { Admin: 3, Analyst: 2, Viewer: 1 };
        const userLevel = roleHierarchy[user.role];
        const requiredLevel = roleHierarchy[requiredRole];

        if (userLevel < requiredLevel) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                    <div className="glass-panel p-8 rounded-2xl text-center max-w-md border-red-500/20">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <span className="text-3xl">🚫</span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-white mb-2 shadow-red-500/20">Access Denied</h2>
                        <p className="text-slate-400 font-medium whitespace-pre-wrap">
                            System Authorization Error:{"\n"}
                            Insufficient security clearance for this terminal.
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
}
