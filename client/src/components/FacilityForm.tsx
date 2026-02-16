import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Facility } from '../types';

interface FacilityFormProps {
    facility?: Facility | null;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export function FacilityForm({ facility, onClose, onSubmit }: FacilityFormProps) {
    const isEditing = !!facility;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: facility?.name || '',
        type: facility?.type || 'Hospital',
        capacity: facility?.capacity || 100,
        currentLoad: facility?.currentLoad || 0,
        location: {
            longitude: facility?.location.coordinates[0] || 3.3792,
            latitude: facility?.location.coordinates[1] || 6.5244,
        },
        status: facility?.status || 'Active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const submissionData = {
                ...formData,
                location: {
                    type: 'Point',
                    coordinates: [formData.location.longitude, formData.location.latitude]
                }
            };
            await onSubmit(submissionData);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save facility');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white">
                        {isEditing ? 'UPDATE FACILITY' : 'ADD NEW FACILITY'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Facility Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-all"
                                placeholder="e.g. Central Specialist Hospital"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-all appearance-none"
                            >
                                <option value="Hospital">Hospital</option>
                                <option value="Clinic">Clinic</option>
                                <option value="Health Center">Health Center</option>
                                <option value="Specialist Center">Specialist Center</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Total Capacity</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Current Load</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.currentLoad}
                                onChange={(e) => setFormData({ ...formData, currentLoad: parseInt(e.target.value) })}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.location.longitude}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, longitude: parseFloat(e.target.value) }
                                })}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-slate-500 uppercase">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.location.latitude}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, latitude: parseFloat(e.target.value) }
                                })}
                                className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'SAVING...' : isEditing ? 'UPDATE FACILITY' : 'CREATE FACILITY'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
