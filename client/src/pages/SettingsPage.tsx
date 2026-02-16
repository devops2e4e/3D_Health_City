import { useState, useEffect, type FormEvent } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { TopNav } from '../components/TopNav';
import { User, Lock, Bell, Save } from 'lucide-react';

export function SettingsPage() {
    const { user, loadUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Profile form
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Preferences
    const [overcapacity, setOvercapacity] = useState(user?.preferences.alertThresholds.overcapacity || 85);
    const [critical, setCritical] = useState(user?.preferences.alertThresholds.critical || 95);
    const [underservedRadius, setUnderservedRadius] = useState(user?.preferences.alertThresholds.underservedRadius || 5);

    // Sync state with user data
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setOvercapacity(user.preferences.alertThresholds.overcapacity);
            setCritical(user.preferences.alertThresholds.critical);
            setUnderservedRadius(user.preferences.alertThresholds.underservedRadius);
        }
    }, [user]);

    const handleProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.updateProfile({ name, email });
            await loadUser();
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handlePasswordUpdate = async (e: FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        try {
            await api.updatePassword(currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        }
    };

    const handlePreferencesUpdate = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await api.updatePreferences({
                alertThresholds: {
                    overcapacity,
                    critical,
                    underservedRadius,
                },
            });
            await loadUser();
            setMessage({ type: 'success', text: 'Preferences updated successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update preferences' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <TopNav />

            <div className="max-w-4xl mx-auto p-6 space-y-8 pt-24">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
                        Terminal <span className="text-neon-blue">Settings</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Configure network parameters and security protocols</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="flex border-b border-slate-700/50 bg-slate-900/40">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-4 font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'profile'
                                ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`px-6 py-4 font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'password'
                                ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`px-6 py-4 font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'preferences'
                                ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Preferences
                            </div>
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field bg-slate-900/50 border-slate-700 focus:border-neon-blue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field bg-slate-900/50 border-slate-700 focus:border-neon-blue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2">Security Role</label>
                                    <input
                                        type="text"
                                        value={user?.role || ''}
                                        className="input-field bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed"
                                        disabled
                                    />
                                    <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">Contact command center to escalate clearance.</p>
                                </div>
                                <button type="submit" className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs">
                                    <Save className="w-4 h-4" />
                                    Sync Profile
                                </button>
                            </form>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input-field"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Min 8 characters, uppercase, lowercase, and number</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary px-6 py-2 flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Update Password
                                </button>
                            </form>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <form onSubmit={handlePreferencesUpdate} className="space-y-8 max-w-lg">
                                <div>
                                    <h3 className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        Intelligence Thresholds
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="group">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    Overcapacity Warning
                                                </label>
                                                <span className="text-sm font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                                                    {overcapacity}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="50"
                                                max="100"
                                                value={overcapacity}
                                                onChange={(e) => setOvercapacity(Number(e.target.value))}
                                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
                                            />
                                            <p className="text-[10px] text-slate-500 mt-2 font-medium">
                                                Trigger amber alerts and system warnings when facility load exceeds this value.
                                            </p>
                                        </div>

                                        <div className="group">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    Critical Threshold
                                                </label>
                                                <span className="text-sm font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                    {critical}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="80"
                                                max="100"
                                                value={critical}
                                                onChange={(e) => setCritical(Number(e.target.value))}
                                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 transition-all"
                                            />
                                            <p className="text-[10px] text-slate-500 mt-2 font-medium">
                                                Emergency protocols and critical notifications activation point.
                                            </p>
                                        </div>

                                        <div className="group">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    Underserved Analysis Radius
                                                </label>
                                                <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                                    {underservedRadius}km
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                value={underservedRadius}
                                                onChange={(e) => setUnderservedRadius(Number(e.target.value))}
                                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                                            />
                                            <p className="text-[10px] text-slate-500 mt-2 font-medium">
                                                Search radius for mapping coverage gaps in city health sectors.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs">
                                    <Save className="w-4 h-4" />
                                    Write Preferences
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
