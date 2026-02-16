import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TopNav } from '../components/TopNav';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDate, formatTime } from '../lib/utils';
import { CommandTicker } from '../components/CommandTicker';

export function AlertsPage() {
    const { data: alerts = [], refetch } = useQuery({
        queryKey: ['alerts'],
        queryFn: () => api.getAlerts(50),
        refetchInterval: 15000, // Refetch every 15 seconds
    });

    const handleAcknowledge = async (alertId: string) => {
        try {
            await api.acknowledgeAlert(alertId);
            refetch();
        } catch (error) {
            console.error('Failed to acknowledge alert:', error);
        }
    };

    const unacknowledgedAlerts = alerts.filter((alert: any) => !alert.acknowledged);
    const acknowledgedAlerts = alerts.filter((alert: any) => alert.acknowledged);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
            case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/50';
            case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/50';
            case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/50';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <XCircle className="w-5 h-5 text-red-500 animate-pulse" />;
            case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'medium': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'low': return <Clock className="w-5 h-5 text-blue-500" />;
            default: return <AlertTriangle className="w-5 h-5 text-slate-600" />;
        }
    };

    const AlertCard = ({ alert, showAcknowledge = true }: any) => (
        <div className={`glass-panel p-6 rounded-2xl border-l-4 overflow-hidden relative group transition-all hover:bg-slate-800/40 ${alert.severity === 'critical' ? 'border-l-red-500 bg-red-500/5' :
            alert.severity === 'high' ? 'border-l-orange-500' :
                alert.severity === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'
            }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                {alert.type.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <p className="text-white font-bold tracking-wide mb-1 text-lg">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                            <span>{formatDate(alert.timestamp)}</span>
                            <span>{formatTime(alert.timestamp)}</span>
                        </div>
                        {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                            <div className="mt-2 text-sm text-slate-600">
                                {alert.metadata.loadPercentage && (
                                    <span>Load: {alert.metadata.loadPercentage}%</span>
                                )}
                                {alert.metadata.nearbyFacilities !== undefined && (
                                    <span> • Nearby facilities: {alert.metadata.nearbyFacilities}</span>
                                )}
                            </div>
                        )}
                        {alert.acknowledged && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Acknowledged {formatDate(alert.acknowledgedAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
                {showAcknowledge && !alert.acknowledged && (
                    <button
                        onClick={() => handleAcknowledge(alert._id)}
                        className="btn-primary px-4 py-2 text-sm whitespace-nowrap"
                    >
                        Acknowledge
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <TopNav />

            <div className="max-w-5xl mx-auto p-6 space-y-8 pt-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
                            System <span className="text-red-500">Alerts</span>
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Real-time emergency monitoring and facility status logs</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stat-card">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter mb-1">Total Logs</p>
                        <p className="text-3xl font-bold text-white">{alerts.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter mb-1">Unresolved</p>
                        <p className="text-3xl font-bold text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">{unacknowledgedAlerts.length}</p>
                    </div>
                    <div className="stat-card">
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter mb-1">Resolved</p>
                        <p className="text-3xl font-bold text-emerald-500">{acknowledgedAlerts.length}</p>
                    </div>
                </div>

                {/* Unacknowledged Alerts */}
                {unacknowledgedAlerts.length > 0 && (
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            Active Alerts ({unacknowledgedAlerts.length})
                        </h2>
                        <div className="space-y-3">
                            {unacknowledgedAlerts.map((alert: any) => (
                                <AlertCard key={alert._id} alert={alert} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Acknowledged Alerts */}
                {acknowledgedAlerts.length > 0 && (
                    <div className="pt-8">
                        <h2 className="text-xl font-heading font-bold text-slate-500 mb-6 uppercase tracking-wider">
                            Resolved Logs ({acknowledgedAlerts.length})
                        </h2>
                        <div className="space-y-3">
                            {acknowledgedAlerts.map((alert: any) => (
                                <AlertCard key={alert._id} alert={alert} showAcknowledge={false} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {alerts.length === 0 && (
                    <div className="card bg-white text-center py-12">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Alerts</h3>
                        <p className="text-slate-600">All systems are operating normally</p>
                    </div>
                )}
            </div>
            <CommandTicker />
        </div>
    );
}
