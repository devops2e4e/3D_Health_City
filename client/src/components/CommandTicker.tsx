import { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

const MESSAGES = [
    "SYSTEM CHECK: DIGITAL TWIN SYNCHRONIZATION SUCCESSFUL",
    "INSIGHT: NETWORK LOAD REACHING PEAK IN SECTOR 7",
    "PREDICTIVE MODEL: CENTRAL CLINIC AT 92% CAPACITY BY 18:00",
    "SECURE: ENCRYPTED DATA STREAM ESTABLISHED",
    "HOSPITAL ADMISSIONS TALLY: +12% IN LAST 4 HOURS",
    "ALERT: ANOMALY DETECTED IN WESTERN DISTRICT COVERAGE",
    "OPTIMIZATION: RESOURCE ALLOCATION REALIGNED FOR MD HOSPITAL",
];

export function CommandTicker() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-white/5 z-50 h-10 flex items-center px-6 overflow-hidden">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400 shrink-0">
                <div className="flex gap-1 animate-pulse">
                    <Zap className="w-3 h-3" />
                    <ShieldCheck className="w-3 h-3" />
                    <Activity className="w-3 h-3" />
                </div>
                GLOBAL COMMAND CENTER:
            </div>

            <div className="ml-8 flex items-center gap-4 animate-in slide-in-from-right duration-1000 overflow-hidden whitespace-nowrap">
                <p className="text-[11px] font-mono text-white/60 tracking-widest uppercase">
                    {MESSAGES[index]}
                </p>
                <div className="w-40 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <p className="text-[11px] font-mono text-white/40 tracking-widest uppercase">
                    {MESSAGES[(index + 1) % MESSAGES.length]}
                </p>
            </div>

            <div className="ml-auto flex items-center gap-4 text-[10px] font-mono text-slate-500 shrink-0">
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    SYNC SECURE
                </span>
                <span>v1.0.4-PREV</span>
            </div>
        </div>
    );
}
