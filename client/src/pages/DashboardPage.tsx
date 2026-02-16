import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CityScene } from '../components/CityScene';
import { StatsCards } from '../components/StatsCards';
import { DetailPanel } from '../components/DetailPanel';
import { TopNav } from '../components/TopNav';
import { CommandTicker } from '../components/CommandTicker';
import { Footer } from '../components/Footer';
import {
    Activity,
    Shield,
    Zap,
    BarChart,
    Cpu,
    Database
} from 'lucide-react';
import type { Facility } from '../types';

export function DashboardPage() {
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

    // Fetch facilities
    const { data: facilities = [], isLoading } = useQuery({
        queryKey: ['facilities'],
        queryFn: () => api.getFacilities(),
        refetchInterval: 30000,
    });

    // Fetch statistics
    const { data: stats } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => api.getStatistics(),
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-neon-blue animate-spin shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                    </div>
                    <p className="text-xl font-heading font-bold text-white tracking-widest animate-pulse">
                        INITIALIZING SYSTEM...
                    </p>
                    <p className="mt-2 text-slate-500 font-mono text-xs uppercase tracking-tighter">
                        Loading PulseCity Digital Twin
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            {/* --- TOP NAVIGATION --- */}
            <div className="w-full z-[60] relative">
                <TopNav />
            </div>

            {/* --- HERO SECTION --- */}
            <section className="relative flex-1 w-full flex flex-col items-center justify-start overflow-hidden pt-4">
                {/* 3D City Scene Container - Slightly Wider Width */}
                <div className="relative w-full max-w-6xl h-[80vh] md:h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10 bg-slate-900/40 mx-auto px-4 md:px-0">

                    <div className="absolute inset-0">
                        <CityScene
                            facilities={facilities}
                            onFacilityClick={setSelectedFacility}
                            selectedFacilityId={selectedFacility?._id}
                        />
                    </div>

                    {/* Stats Cards Overlay - Positioned at the top */}
                    <div className="absolute top-6 left-6 right-6 pointer-events-none transition-opacity duration-300">
                        <StatsCards stats={stats} />
                    </div>

                    {/* Detail Panel */}
                    {selectedFacility && (
                        <DetailPanel
                            facility={selectedFacility}
                            onClose={() => setSelectedFacility(null)}
                        />
                    )}
                </div>

                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            </section>

            {/* --- LIVE METRICS SECTION --- */}
            <section className="relative py-24 bg-slate-950 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-900/40 group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Monitoring</h3>
                            </div>
                            <div className="text-4xl font-heading font-bold text-white mb-2">12.4K</div>
                            <p className="text-xs text-slate-500 font-mono tracking-wider">Health sensors currently streaming live data from Sectors 1-9.</p>
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-900/40 group hover:border-violet-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inference Speed</h3>
                            </div>
                            <div className="text-4xl font-heading font-bold text-white mb-2">42ms</div>
                            <p className="text-xs text-slate-500 font-mono tracking-wider">Real-time predictive response for anomaly detection across the network.</p>
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-900/40 group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Network Uptime</h3>
                            </div>
                            <div className="text-4xl font-heading font-bold text-white mb-2">99.9%</div>
                            <p className="text-xs text-slate-500 font-mono tracking-wider">High-availability redundancy ensures constant metropolitan coverage.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- INTELLIGENCE FEATURES SECTION --- */}
            <section className="py-24 relative overflow-hidden bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-heading font-bold text-white mb-4 tracking-tight">Intelligence Capabilities</h2>
                        <div className="h-1 w-20 bg-blue-600 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Spatial Analytics */}
                        <div className="glass-panel group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-1 flex flex-col">
                            <div className="p-6 pb-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <BarChart className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Spatial Analytics</h3>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">Heat-mapping and location intelligence identifying metropolitan coverage gaps.</p>
                            </div>
                            <div className="mt-auto h-40 bg-slate-950/80 rounded-2xl mx-4 mb-4 border border-white/5 overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-slate-900/50">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">Sector_Heat_View</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex-1 p-3 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent">
                                    <div className="grid grid-cols-4 gap-2 w-full h-full opacity-30">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="bg-slate-800/50 rounded-sm border border-white/5" />
                                        ))}
                                    </div>
                                    <div className="absolute w-12 h-12 border border-blue-500/40 rounded-full animate-ping" />
                                </div>
                                <div className="bg-blue-600/5 px-3 py-1 text-[8px] font-mono text-blue-400/60 flex justify-between">
                                    <span>ZOOM: 12.5x</span>
                                    <span>GRID_SYNCHRONIZED</span>
                                </div>
                            </div>
                        </div>

                        {/* AI-Driven Predictions */}
                        <div className="glass-panel group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-1 flex flex-col">
                            <div className="p-6 pb-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">AI Predictions</h3>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">Forecasting models predicting upcoming critical thresholds up to 48h in advance.</p>
                            </div>
                            <div className="mt-auto h-40 bg-slate-950/80 rounded-2xl mx-4 mb-4 border border-white/5 overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-slate-900/50">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">Neural_Network_Output</span>
                                    <span className="text-[9px] font-mono text-violet-400">READY</span>
                                </div>
                                <div className="flex-1 p-3 space-y-2 flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 bg-violet-500/40 rounded-full flex-1" style={{ width: '85%' }} />
                                        <span className="text-[8px] font-mono text-violet-400">PROB: 0.94</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 bg-blue-500/40 rounded-full flex-1" style={{ width: '62%' }} />
                                        <span className="text-[8px] font-mono text-blue-400">PROB: 0.62</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 bg-emerald-500/40 rounded-full flex-1" style={{ width: '45%' }} />
                                        <span className="text-[8px] font-mono text-emerald-400">PROB: 0.45</span>
                                    </div>
                                </div>
                                <div className="bg-violet-600/5 px-3 py-1 text-[8px] font-mono text-violet-400/60">
                                    RECALIBRATING_WEIGHTS...
                                </div>
                            </div>
                        </div>

                        {/* Unified Infrastructure */}
                        <div className="glass-panel group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-1 flex flex-col">
                            <div className="p-6 pb-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Metropolitan Assets</h3>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">Centralized management for all healthcare assets synchronized with GIS data.</p>
                            </div>
                            <div className="mt-auto h-40 bg-slate-950/80 rounded-2xl mx-4 mb-4 border border-white/5 overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-slate-900/50">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">Database_Mirror</span>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-2.5 h-2.5 text-emerald-500" />
                                        <span className="text-[8px] text-emerald-500">ENCRYPTED</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-4 grid grid-cols-2 gap-3 opacity-60">
                                    <div className="h-full border border-white/5 bg-slate-900 rounded p-2 flex flex-col gap-1">
                                        <div className="h-1 w-6 bg-slate-700 rounded" />
                                        <div className="h-1 w-10 bg-slate-800 rounded" />
                                    </div>
                                    <div className="h-full border border-white/5 bg-slate-900 rounded p-2 flex flex-col gap-1">
                                        <div className="h-1 w-6 bg-slate-700 rounded" />
                                        <div className="h-1 w-10 bg-slate-800 rounded" />
                                    </div>
                                </div>
                                <div className="bg-emerald-600/5 px-3 py-1 text-[8px] font-mono text-emerald-400/60 flex justify-between">
                                    <span>SYNC_COMPLETE</span>
                                    <span>NODE: LNX-02</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trusted By Strip */}
                    <div className="pt-24 border-t border-white/5">
                        <p className="text-center text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mb-12">Core Integration Partners</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            <div className="flex items-center gap-3">
                                <Shield className="w-8 h-8 text-blue-400" />
                                <span className="text-lg font-heading font-bold text-white tracking-tighter">Ministry of Health</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Database className="w-8 h-8 text-violet-400" />
                                <span className="text-lg font-heading font-bold text-white tracking-tighter">Urban Planning Dept</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity className="w-8 h-8 text-emerald-400" />
                                <span className="text-lg font-heading font-bold text-white tracking-tighter">Disaster Response</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <CommandTicker />
        </div>
    );
}
