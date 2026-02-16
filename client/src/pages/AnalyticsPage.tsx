import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TopNav } from '../components/TopNav';
import { CommandTicker } from '../components/CommandTicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertTriangle, Building2, Activity, MapPin } from 'lucide-react';

export function AnalyticsPage() {
    const { data: facilities = [] } = useQuery({
        queryKey: ['facilities'],
        queryFn: () => api.getFacilities(),
    });

    const { data: stats } = useQuery({
        queryKey: ['statistics'],
        queryFn: () => api.getStatistics(),
    });

    const { data: analysis } = useQuery({
        queryKey: ['coverageAnalysis'],
        queryFn: () => api.getCoverageAnalysis(),
    });

    // Calculate analytics data
    const facilityTypeData = stats ? [
        { name: 'Hospitals', value: stats.byType.hospitals, color: '#3B82F6' },
        { name: 'Clinics', value: stats.byType.clinics, color: '#10B981' },
        { name: 'Health Centers', value: stats.byType.healthCenters, color: '#F59E0B' },
    ] : [];

    const loadDistribution = facilities.reduce((acc: any[], facility: any) => {
        const loadPercentage = Math.round((facility.currentLoad / facility.capacity) * 100);
        const range = loadPercentage <= 50 ? '0-50%' :
            loadPercentage <= 70 ? '51-70%' :
                loadPercentage <= 85 ? '71-85%' :
                    loadPercentage <= 100 ? '86-100%' : '>100%';

        const existing = acc.find(item => item.range === range);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ range, count: 1 });
        }
        return acc;
    }, []);

    const topFacilities = [...facilities]
        .sort((a: any, b: any) => {
            const aLoad = (a.currentLoad / a.capacity) * 100;
            const bLoad = (b.currentLoad / b.capacity) * 100;
            return bLoad - aLoad;
        })
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <TopNav />

            <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
                            Intelligence <span className="text-neon-blue">Analytics</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Real-time health network monitoring and performance metrics</p>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Total Facilities</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats?.totalFacilities || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <Building2 className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Overcapacity</p>
                                <p className="text-3xl font-bold text-red-500 mt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">{stats?.overcapacityFacilities || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">Avg Load</p>
                                <p className="text-3xl font-bold text-violet-400 mt-1 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">{stats?.avgLoadPercentage || 0}%</p>
                            </div>
                            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                                <Activity className="w-6 h-6 text-violet-500" />
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">System Health</p>
                                <p className={`text-3xl font-bold mt-1 ${stats && stats.avgLoadPercentage < 85 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'text-red-400'}`}>
                                    {stats && stats.avgLoadPercentage < 85 ? 'OPTIMAL' : 'CRITICAL'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Facility Type Distribution */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-6">Network Composition</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={facilityTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {facilityTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Load Distribution */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-6">Inundation Analysis</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={loadDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis
                                    dataKey="range"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Facilities by Load */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-6 font-heading">High-Load Facilities Monitor</h3>
                    <div className="space-y-4">
                        {topFacilities.map((facility: any, index: number) => {
                            const loadPercentage = Math.round((facility.currentLoad / facility.capacity) * 100);
                            const colorClass = loadPercentage > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                loadPercentage > 85 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                                    loadPercentage > 70 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                        'bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.5)]';

                            return (
                                <div key={facility._id} className="flex items-center gap-6 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/40 transition-all group">
                                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-sm font-bold text-white border border-slate-700 group-hover:border-neon-blue transition-colors">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white tracking-wide">{facility.name}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-tighter">{facility.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-lg text-white">{loadPercentage}%</p>
                                        <p className="text-[10px] text-slate-500 font-mono uppercase">Ld: {facility.currentLoad} / Cap: {facility.capacity}</p>
                                    </div>
                                    <div className="w-32 hidden md:block">
                                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                                            <div
                                                className={`${colorClass} h-full rounded-full transition-all duration-500`}
                                                style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Historical Trends */}
                    <div className="lg:col-span-3 glass-panel p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                System-wide Load Trends
                            </h2>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">Snapshot Interval: 1H</span>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { time: '00:00', load: 45 }, { time: '04:00', load: 32 },
                                    { time: '08:00', load: 68 }, { time: '12:00', load: 85 },
                                    { time: '16:00', load: 72 }, { time: '20:00', load: 58 },
                                    { time: 'now', load: stats?.avgLoadPercentage || 77 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Geography Coverage Issues */}
                    {analysis?.underservedZones && analysis.underservedZones.length > 0 && (
                        <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border-orange-500/20 bg-orange-500/5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5 text-orange-400" />
                                Geographic Coverage Gaps
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {analysis.underservedZones.slice(0, 4).map((zone: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Zone {idx + 1}</p>
                                        <p className="text-sm font-bold text-white mb-2">Underserved Sector</p>
                                        <div className="text-[10px] font-mono text-orange-400">
                                            [{zone.location[1].toFixed(4)}, {zone.location[0].toFixed(4)}]
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <CommandTicker />
        </div>
    );
}
