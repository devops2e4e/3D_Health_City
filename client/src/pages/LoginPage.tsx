import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2 } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();
    const { login, error, isLoading, clearError } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();

        try {
            await login(email, password);
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
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl mb-6 shadow-2xl shadow-blue-900/40 border border-white/10 group">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-heading font-bold text-white mb-2 tracking-tighter">
                        Pulse<span className="text-neon-blue">City</span>
                    </h1>
                    <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Digital Twin Intelligence</p>
                </div>

                {/* Login Card */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-heading font-bold text-white mb-8">
                        Secure Login
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 text-white placeholder:text-slate-600"
                                placeholder="name@terminal.gov"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field bg-slate-900/50 border-slate-700/50 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 text-white placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-4 font-bold uppercase tracking-[0.2em] text-xs shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-slate-500 font-medium uppercase tracking-widest">
                        New Operator?{' '}
                        <Link to="/register" className="text-neon-blue hover:text-white transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-slate-600 mt-10 font-mono uppercase tracking-[0.3em]">
                    Department of Spatial Intelligence // v1.0.42
                </p>
            </div>
        </div>
    );
}
