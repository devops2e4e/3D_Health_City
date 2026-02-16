import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2 } from 'lucide-react';

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, error, isLoading, clearError } = useAuthStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'Viewer' | 'Analyst' | 'Admin'>('Viewer');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setValidationError('');

        // Validation
        if (password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            setValidationError('Password must contain uppercase, lowercase, and number');
            return;
        }

        try {
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            // Error is handled by the store
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Cyberpunk Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>

            <div className="relative w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl mb-4 shadow-2xl shadow-blue-900/40 border border-white/10">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-white mb-1 tracking-tighter">
                        Pulse<span className="text-neon-blue">City</span>
                    </h1>
                    <p className="text-slate-400 font-medium tracking-widest text-[10px] uppercase">New Operator Onboarding</p>
                </div>

                {/* Register Card */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-heading font-bold text-white mb-6">
                        Create Account
                    </h2>

                    {(error || validationError) && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            {error || validationError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue text-white text-sm"
                                    placeholder="Operator Name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue text-white text-sm"
                                    placeholder="id@terminal.gov"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue text-white text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue text-white text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-tighter">
                            Requirement: 8+ Chars, A-Z, a-z, 0-9
                        </p>

                        <div>
                            <label htmlFor="role" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                Account Role
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue text-white text-sm"
                            >
                                <option value="Viewer">Level 1: Viewer</option>
                                <option value="Analyst">Level 2: Analyst</option>
                                <option value="Admin">Level 3: Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-slate-500 font-medium uppercase tracking-widest">
                        Already have access?{' '}
                        <Link to="/login" className="text-neon-blue hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-slate-600 mt-8 font-mono uppercase tracking-[0.3em]">
                    Department of Spatial Intelligence // v1.0.42
                </p>
            </div>
        </div>
    );
}
