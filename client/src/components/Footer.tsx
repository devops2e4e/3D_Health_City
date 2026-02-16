import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    Bell,
    Settings,
    Shield,
    Globe,
    Building2,
    Mail,
    ChevronRight
} from 'lucide-react';
import logo from '../assets/pulse_city_logo.png';

export function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                                <img src={logo} alt="PulseCity Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-xl font-heading font-bold text-white tracking-tight">PulseCity</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Advanced Digital Twin Intelligence platform for real-time metropolitan health infrastructure monitoring and predictive risk analysis.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <Globe className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <Mail className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center hover:border-violet-500/50 transition-colors cursor-pointer group">
                                <svg className="w-4 h-4 text-slate-500 group-hover:text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Intelligence Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            INTELLIGENCE
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                    3D Digital Twin
                                </Link>
                            </li>
                            <li>
                                <Link to="/analytics" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                    Analytics Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/alerts" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                    Real-time Alerts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Infrastructure Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-violet-500" />
                            INFRASTRUCTURE
                        </h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/manage" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-violet-500 transition-transform group-hover:translate-x-1" />
                                    Facility Registry
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-violet-500 transition-transform group-hover:translate-x-1" />
                                    System Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Status Check */}
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">
                                System Online
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-6 leading-relaxed">
                            Secure encrypted connection established with Central Health Intelligence.
                        </p>
                        <div className="pt-4 border-t border-white/5">
                            <span className="text-[9px] text-slate-600 font-mono tracking-[0.2em] uppercase">
                                Node: LAGOS-SPATIAL-01
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                    <p>© 2026 PulseCity Intelligence. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Protocol</Link>
                        <Link to="#" className="hover:text-white transition-colors">Security Standards</Link>
                        <Link to="#" className="hover:text-white transition-colors">v1.0.42-STABLE</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
