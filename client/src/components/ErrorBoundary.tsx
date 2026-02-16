import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('SYSTEM_CRITICAL_ERROR:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
                    <div className="glass-panel p-10 rounded-3xl border border-red-500/20 max-w-2xl w-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">SYSTEM CRITICAL ERROR</h1>
                                <p className="text-red-400 text-sm font-mono mt-1 uppercase tracking-widest">Digital Twin Synchronization Failed</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 font-mono text-sm overflow-auto mb-8 max-h-60">
                            <p className="text-red-400 font-bold mb-2">Error Log:</p>
                            <pre className="text-slate-400 whitespace-pre-wrap">{this.state.error?.message}</pre>
                            <pre className="text-slate-600 mt-4 text-[10px] leading-tight">{this.state.error?.stack}</pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-[0.2em]"
                        >
                            Attempt System Reboot
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
