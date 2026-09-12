import React from 'react';
import { useMultiverse } from '../context/MultiverseContext';
import { CircleDot, CloudLightning, DoorOpen, School, Clock, MessageSquareText, BarChart3, Orbit, FileText, Volume2, VolumeX, RotateCcw } from 'lucide-react';

const MODULES = [
    { id: 'core', label: 'Multiverse Core', short: 'CORE', icon: Orbit },
    { id: 'engine', label: 'Multiverse Engine', short: 'ENG', icon: CircleDot },
    { id: 'weather', label: 'Brain Weather', short: 'BWX', icon: CloudLightning },
    { id: 'amnesia', label: 'Room Amnesia', short: 'AMN', icon: DoorOpen },
    { id: 'chaos', label: 'Classroom Chaos', short: 'CHX', icon: School },
    { id: 'time', label: 'Time Machine', short: 'TMX', icon: Clock },
    { id: 'replay', label: 'Conversation Replay', short: 'CVR', icon: MessageSquareText },
    { id: 'stats', label: 'Useless Statistics', short: 'STX', icon: BarChart3 },
    { id: 'report', label: 'Final Report', short: 'RPT', icon: FileText },
];

export function TopBar() {
    const { state, setAudio, reset } = useMultiverse();
    const systemLabel = state.backendStatus === 'checking'
        ? 'Systems · Checking'
        : state.backendStatus === 'online'
            ? 'Systems · Online'
            : 'Systems · Offline';
    return (
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/70 border-b border-cyan-500/15">
            <div className="max-w-[1440px] mx-auto flex items-center gap-4 px-6 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full border border-cyan-400/60 flex items-center justify-center anim-pulse-glow">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <div className="absolute inset-0 rounded-full border border-cyan-400/30 anim-ring-rotate" />
                    </div>
                    <div>
                        <div className="font-serif-display text-lg leading-none text-white">Multiverse <em className="text-cyan-mv not-italic">Pro</em></div>
                        <div className="font-mono-tel text-[9px] uppercase tracking-widest text-muted-mv mt-0.5">Reality Simulation Suite · v2077.3</div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 ml-6">
                    <span className={`chip ${state.backendStatus === 'offline' ? 'border-rose-400/30 text-rose-300' : ''}`}><span className="node-dot" style={{ width: 6, height: 6 }} /> {systemLabel}</span>
                    <span className="chip border-amber-400/30 text-amber-300">Nonsense · Critical</span>
                    <span className="chip border-rose-400/30 text-rose-300">Usefulness · 0.00%</span>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => setAudio(!state.audioOn)}
                        data-testid="top-audio-toggle"
                        className="chip hover:text-white hover:border-cyan-400/60 transition"
                    >
                        {state.audioOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
                        <span>{state.audioOn ? 'On' : 'Off'}</span>
                    </button>
                    <button
                        onClick={reset}
                        data-testid="reset-multiverse"
                        className="chip hover:text-white hover:border-rose-400/60 transition"
                        title="Collapse current reality"
                    >
                        <RotateCcw size={12} /> <span>Collapse</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export function Dock() {
    const { state, setActive } = useMultiverse();
    return (
        <aside className="hidden lg:flex sticky top-[64px] self-start flex-col gap-1 w-[210px] p-3 rounded-xl glass ml-4 mt-4">
            <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80 px-2 py-2">Subsystems</div>
            {MODULES.map((m) => {
                const Icon = m.icon;
                const active = state.active === m.id;
                return (
                    <button
                        key={m.id}
                        onClick={() => setActive(m.id)}
                        data-testid={`dock-${m.id}`}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all border ${
                            active
                                ? 'bg-cyan-500/10 border-cyan-400/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white hover:border-slate-700/40'
                        }`}
                    >
                        <Icon size={16} className={active ? 'text-cyan-mv' : 'text-slate-500 group-hover:text-cyan-mv'} />
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] leading-tight truncate">{m.label}</div>
                            <div className="font-mono-tel text-[9px] uppercase tracking-widest text-muted-mv mt-0.5">Node · {m.short}</div>
                        </div>
                        {active && <span className="node-dot" />}
                    </button>
                );
            })}
        </aside>
    );
}

export function MobileTabs() {
    const { state, setActive } = useMultiverse();
    return (
        <div className="lg:hidden overflow-x-auto flex gap-2 px-4 py-3 border-b border-cyan-500/10 bg-slate-950/50 backdrop-blur">
            {MODULES.map((m) => {
                const active = state.active === m.id;
                return (
                    <button
                        key={m.id}
                        onClick={() => setActive(m.id)}
                        data-testid={`mtab-${m.id}`}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono-tel uppercase tracking-widest border transition ${
                            active ? 'border-cyan-400/60 text-white bg-cyan-500/10' : 'border-slate-700/50 text-slate-400'
                        }`}
                    >
                        {m.short}
                    </button>
                );
            })}
        </div>
    );
}

export { MODULES };
