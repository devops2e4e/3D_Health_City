import { Building2, AlertTriangle, Activity } from 'lucide-react';
import type { Statistics } from '../types';
import { formatNumber } from '../lib/utils';

interface StatsCardsProps {
    stats?: Statistics;
}

export function StatsCards({ stats }: StatsCardsProps) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
            {/* Total Facilities */}
            <div className="stat-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-400">Total Facilities</p>
                        <p className="text-3xl font-bold text-white mt-1">
                            {formatNumber(stats.totalFacilities)}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                </div>
                <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{stats.byType.hospitals} Hospitals</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{stats.byType.clinics} Clinics</span>
                </div>
            </div>

            {/* Overcapacity */}
            <div className="stat-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-400">Overcapacity</p>
                        <p className="text-3xl font-bold text-red-500 mt-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                            {formatNumber(stats.overcapacityFacilities)}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                </div>
                <div className="mt-4 text-xs text-slate-400">
                    <span className="text-red-400 font-medium">
                        {((stats.overcapacityFacilities / stats.totalFacilities) * 100).toFixed(1)}%
                    </span>
                    {' '}of total network limit
                </div>
            </div>

            {/* Average Load */}
            <div className="stat-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-400">Network Load</p>
                        <p className="text-3xl font-bold text-violet-400 mt-1 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                            {stats.avgLoadPercentage}%
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center border border-violet-500/20">
                        <Activity className="w-6 h-6 text-violet-500" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                            style={{ width: `${stats.avgLoadPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
