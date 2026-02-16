import { X, MapPin, Users, Activity, Calendar } from 'lucide-react';
import type { Facility } from '../types';
import { getStatusLabel, getStatusColor, formatNumber, formatDate } from '../lib/utils';

interface DetailPanelProps {
    facility: Facility;
    onClose: () => void;
}

export function DetailPanel({ facility, onClose }: DetailPanelProps) {
    const loadPercentage = facility.loadPercentage ||
        Math.round((facility.currentLoad / facility.capacity) * 100);

    const statusLabel = getStatusLabel(loadPercentage);
    const statusColor = `#${getStatusColor(loadPercentage).toString(16).padStart(6, '0')}`;

    return (
        <div className="absolute top-0 right-0 h-full w-full md:w-96 glass-panel border-l border-slate-700 shadow-2xl overflow-y-auto animate-slide-in-right z-40">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-6 flex items-start justify-between z-10">
                <div className="flex-1">
                    <h2 className="text-2xl font-heading font-bold text-white tracking-wide">
                        {facility.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">{facility.type}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
                >
                    <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="glass-panel p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Current Status</span>
                        <div
                            className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg uppercase tracking-wide border border-white/10"
                            style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}40` }}
                        >
                            {statusLabel}
                        </div>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-white tracking-tight" style={{ textShadow: `0 0 20px ${statusColor}40` }}>
                            {loadPercentage}%
                        </span>
                        <span className="text-sm text-slate-500 mb-1.5">Load Capacity</span>
                    </div>
                </div>

                {/* Capacity Info */}
                <div className="glass-panel rounded-xl p-5 bg-slate-800/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-slate-200">Capacity Metrics</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Current Patience</span>
                            <span className="font-mono text-slate-200">
                                {formatNumber(facility.currentLoad)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Max Capacity</span>
                            <span className="font-mono text-slate-200">
                                {formatNumber(facility.capacity)}
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-300 relative"
                                style={{
                                    width: `${Math.min(loadPercentage, 100)}%`,
                                    backgroundColor: statusColor,
                                    boxShadow: `0 0 10px ${statusColor}`
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="glass-panel rounded-xl p-5 bg-slate-800/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-slate-200">Geospatial Data</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Latitude</p>
                            <p className="font-mono text-emerald-400 mt-1">{facility.location.coordinates[1].toFixed(4)}°N</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Longitude</p>
                            <p className="font-mono text-emerald-400 mt-1">{facility.location.coordinates[0].toFixed(4)}°E</p>
                        </div>
                    </div>
                </div>

                {/* Services */}
                {facility.services.length > 0 && (
                    <div className="glass-panel rounded-xl p-5 bg-slate-800/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                <Activity className="w-4 h-4 text-violet-400" />
                            </div>
                            <h3 className="font-semibold text-slate-200">Active Units</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {facility.services.map((service, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-slate-900/60 border border-slate-700 rounded-lg text-xs text-slate-300 hover:border-violet-500/50 transition-colors cursor-default"
                                >
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Last Updated */}
                <div className="glass-panel rounded-xl p-5 bg-slate-800/20">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <Calendar className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-200">Last Sync</h3>
                            <p className="text-xs text-slate-500">Real-time update frequency</p>
                        </div>
                    </div>
                    <p className="text-sm font-mono text-amber-400 text-right mt-2">
                        {formatDate(facility.lastUpdated)}
                    </p>
                </div>
            </div>
        </div>
    );
}
