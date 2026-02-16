import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TopNav } from '../components/TopNav';
import { CommandTicker } from '../components/CommandTicker';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    MapPin,
    Building2,
    Activity,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { FacilityForm } from '../components/FacilityForm';
import type { Facility } from '../types';

export function ManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const queryClient = useQueryClient();

    const { data: facilities = [], isLoading } = useQuery({
        queryKey: ['facilities'],
        queryFn: () => api.getFacilities(),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.createFacility(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => api.updateFacility(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteFacility(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['facilities'] });
        },
    });

    const filteredFacilities = facilities.filter((f: Facility) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this facility?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            <TopNav />

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
                            Facility <span className="text-blue-500">Registry</span>
                            <span className="text-xs font-mono font-medium px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                                MGMT-v1.0
                            </span>
                        </h1>
                        <p className="text-slate-400 mt-2">Manage city health infrastructure and facility configuration</p>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedFacility(null);
                            setIsFormOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                        <Plus className="w-5 h-5" />
                        ADD FACILITY
                    </button>
                </div>

                {/* Filters */}
                <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, type, or sector..."
                            className="w-full bg-slate-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono hover:bg-slate-700">EXPORT_CSV</button>
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono hover:bg-slate-700">FILTERS_ALL</button>
                    </div>
                </div>

                {/* Facility Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-48 glass-panel border-dashed border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFacilities.map((facility: Facility) => (
                            <div key={facility._id} className="glass-panel p-6 rounded-2xl hover:border-blue-500/30 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-all pointer-events-none" />

                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                                        <Building2 className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="absolute top-6 right-6 flex items-center gap-1 z-50 pointer-events-auto">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('Edit clicked for:', facility._id);
                                                setSelectedFacility(facility);
                                                setIsFormOpen(true);
                                            }}
                                            className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/10 backdrop-blur-md"
                                            title="Edit Facility"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('Delete clicked for:', facility._id);
                                                handleDelete(facility._id);
                                            }}
                                            className="p-2 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-white/10 backdrop-blur-md"
                                            title="Delete Facility"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{facility.name}</h3>
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4 uppercase">
                                    <span>{facility.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span>ID: {facility._id.substring(0, 6)}</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Activity className="w-3.5 h-3.5" />
                                            <span>Current Load</span>
                                        </div>
                                        <span className={facility.currentLoad >= facility.capacity ? 'text-red-400 font-bold' : 'text-slate-300 font-bold'}>
                                            {facility.currentLoad}/{facility.capacity}
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${facility.currentLoad / facility.capacity >= 0.9 ? 'bg-red-500' :
                                                facility.currentLoad / facility.capacity >= 0.7 ? 'bg-orange-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${Math.min(100, (facility.currentLoad / facility.capacity) * 100)}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-500 font-mono">
                                        <MapPin className="w-3 h-3" />
                                        {facility.location.coordinates[1].toFixed(4)}, {facility.location.coordinates[0].toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredFacilities.length === 0 && !isLoading && (
                    <div className="text-center py-20 glass-panel border-dashed">
                        <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No Facilities Found</h3>
                        <p className="text-slate-600 mt-1">Try adjusting your search filters</p>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <FacilityForm
                    facility={selectedFacility}
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedFacility(null);
                    }}
                    onSubmit={async (data) => {
                        if (selectedFacility) {
                            await updateMutation.mutateAsync({ id: selectedFacility._id, data });
                        } else {
                            await createMutation.mutateAsync(data);
                        }
                        setIsFormOpen(false);
                        setSelectedFacility(null);
                    }}
                />
            )}

            <CommandTicker />
        </div>
    );
}
