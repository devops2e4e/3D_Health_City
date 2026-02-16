import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import logo from '../assets/pulse_city_logo.png';

export function TopNav() {
    const { user, logout } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="w-full z-50">
            <div className="glass-panel flex items-center justify-between px-6 py-4 border-x-0 border-t-0 rounded-none">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:shadow-blue-900/60 transition-all overflow-hidden">
                        <img src={logo} alt="PulseCity Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-heading font-bold text-white tracking-wide">PulseCity</h1>
                        <p className="text-xs text-slate-400">3D Health Intelligence</p>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-all relative group ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                            }`
                        }
                    >
                        3D City
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-[.active]:scale-x-100 group-hover:scale-x-100" />
                    </NavLink>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-all relative group ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                            }`
                        }
                    >
                        Analytics
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-[.active]:scale-x-100 group-hover:scale-x-100" />
                    </NavLink>
                    <NavLink
                        to="/alerts"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-all relative group ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                            }`
                        }
                    >
                        Alerts
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-[.active]:scale-x-100 group-hover:scale-x-100" />
                    </NavLink>
                    {(user?.role === 'Admin' || user?.role === 'Analyst') && (
                        <NavLink
                            to="/manage"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-all relative group ${isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                                }`
                            }
                        >
                            Manage
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-[.active]:scale-x-100 group-hover:scale-x-100" />
                        </NavLink>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* User Menu */}
                <div
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <button
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                            <User className="w-4 h-4 text-slate-200" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.role}</p>
                        </div>
                    </button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 top-full pt-2 w-48 z-[100] transform origin-top-right transition-all">
                            <div className="glass-panel rounded-xl py-2 overflow-hidden shadow-2xl">
                                <Link
                                    to="/settings"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-blue-600/20 transition-colors"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowDropdown(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full text-left transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden glass-panel border-t border-white/5 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-4 gap-4">
                        <NavLink
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-sm font-medium p-2 rounded-lg transition-colors ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-white/5'
                                }`
                            }
                        >
                            3D City
                        </NavLink>
                        <NavLink
                            to="/analytics"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-sm font-medium p-2 rounded-lg transition-colors ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-white/5'
                                }`
                            }
                        >
                            Analytics
                        </NavLink>
                        <NavLink
                            to="/alerts"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-sm font-medium p-2 rounded-lg transition-colors ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-white/5'
                                }`
                            }
                        >
                            Alerts
                        </NavLink>
                        {(user?.role === 'Admin' || user?.role === 'Analyst') && (
                            <NavLink
                                to="/manage"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `text-sm font-medium p-2 rounded-lg transition-colors ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300 hover:bg-white/5'
                                    }`
                                }
                            >
                                Management
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
