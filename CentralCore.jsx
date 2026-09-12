import React, { useMemo } from 'react';
import { useMultiverse } from '../context/MultiverseContext';
import { computeCoreStats } from '../lib/humor';
import { Panel } from './Panel';
import { CircularMeter, BarMeter, StatChip } from './Meter';
import { MODULES } from './Shell';

const NODE_POSITIONS = {
    engine:   { x: 50, y: 15 },
    weather:  { x: 82, y: 30 },
    amnesia:  { x: 88, y: 65 },
    chaos:    { x: 70, y: 90 },
    time:     { x: 30, y: 90 },
    replay:   { x: 12, y: 65 },
    stats:    { x: 18, y: 30 },
    report:   { x: 50, y: 50 }, // near center
};

export default function CentralCore() {
    const { state, setActive } = useMultiverse();
    const stats = useMemo(() => computeCoreStats(state), [state]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Node graph */}
            <Panel
                className="xl:col-span-2"
                code="MVC · 001"
                title="Multiverse Core"
                subtitle="Central processing hub. All subsystem telemetry is routed through this reactor. Do not attempt to feed logic to it."
                testId="panel-core"
                right={<span className="chip"><span className="node-dot" style={{ width: 6, height: 6 }} /> Reactor Coherent</span>}
                hot
            >
                <div className="relative w-full aspect-[16/10] rounded-lg border border-cyan-500/15 bg-slate-950/50 overflow-hidden">
                    <div className="scanline-overlay" />
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                        {/* connection lines from center to nodes */}
                        {Object.entries(NODE_POSITIONS).filter(([k]) => k !== 'report').map(([key, p]) => (
                            <g key={key}>
                                <line x1="50" y1="50" x2={p.x} y2={p.y} stroke="rgba(34,211,238,0.35)" strokeWidth="0.15" />
                                <line
                                    x1="50" y1="50" x2={p.x} y2={p.y}
                                    stroke="rgba(34,211,238,0.9)"
                                    strokeWidth="0.25"
                                    className="data-stream-path"
                                />
                            </g>
                        ))}
                        {/* concentric rings */}
                        <circle cx="50" cy="50" r="6" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.15" />
                        <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="0.15" strokeDasharray="0.6 0.6" />
                        <circle cx="50" cy="50" r="24" fill="none" stroke="rgba(34,211,238,0.14)" strokeWidth="0.1" strokeDasharray="0.4 0.8" />
                    </svg>

                    {/* Center core */}
                    <button
                        onClick={() => setActive('report')}
                        data-testid="core-center-button"
                        className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full flex items-center justify-center anim-pulse-glow"
                        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.35), rgba(168,85,247,0.15) 60%, transparent 80%)' }}
                    >
                        <div className="absolute inset-2 rounded-full border border-cyan-400/70 anim-ring-rotate" />
                        <div className="absolute inset-5 rounded-full border border-violet-400/50 anim-ring-rotate-rev" />
                        <div className="relative text-center">
                            <div className="font-serif-display text-lg text-white leading-none">Core</div>
                            <div className="font-mono-tel text-[9px] text-cyan-mv/90 tracking-widest mt-1">REACTOR</div>
                        </div>
                    </button>

                    {/* Nodes */}
                    {Object.entries(NODE_POSITIONS).filter(([k]) => k !== 'report').map(([key, p]) => {
                        const mod = MODULES.find((m) => m.id === key);
                        if (!mod) return null;
                        const Icon = mod.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setActive(key)}
                                data-testid={`core-node-${key}`}
                                className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center anim-float"
                                style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${Math.random() * 2}s` }}
                            >
                                <div className="relative w-11 h-11 rounded-full flex items-center justify-center border border-cyan-400/50 bg-slate-950/80 backdrop-blur transition-all group-hover:scale-110 group-hover:border-cyan-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.45)]">
                                    <Icon size={16} className="text-cyan-mv group-hover:text-white transition-colors" />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                                </div>
                                <div className="mt-1 text-[9px] font-mono-tel uppercase tracking-widest text-slate-300 whitespace-nowrap">
                                    {mod.short}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    <StatChip label="Universes" value={stats.universeCount} tone="cyan" testId="stat-universes" />
                    <StatChip label="Rooms Forgotten" value={stats.roomsForgotten} tone="violet" testId="stat-rooms" />
                    <StatChip label="Time Rewrites" value={stats.decisionsReconsidered} tone="amber" testId="stat-time" />
                    <StatChip label="Overthinks" value={stats.overthinks} tone="rose" testId="stat-overthinks" />
                </div>
            </Panel>

            {/* Telemetry */}
            <Panel code="TLM · 002" title="Live Telemetry" subtitle="Reactor vital signs, updated at unnecessary precision." testId="panel-telemetry">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <CircularMeter value={stats.realityIntegrity} label="Reality Integrity" color="#22d3ee" testId="meter-reality" />
                    <CircularMeter value={stats.causalStability} label="Causal Stability" color="#a855f7" testId="meter-causal" />
                    <CircularMeter value={stats.logicalConsistency} label="Logical Consistency" color="#f59e0b" testId="meter-logical" />
                    <CircularMeter value={stats.nonsense} label="Nonsense Levels" color="#f43f5e" testId="meter-nonsense" />
                </div>
                <div className="space-y-3">
                    <BarMeter value={stats.chaosAvg} label="Avg Classroom Chaos" color="#f59e0b" />
                    <BarMeter value={stats.confusionAvg} label="Avg Room Confusion" color="#a855f7" />
                    <BarMeter value={0} label="Actual Usefulness" color="#10b981" suffix="%" />
                </div>
                <div className="mt-5 rounded-md border border-cyan-400/20 bg-cyan-500/5 p-3">
                    <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80 mb-1">System Status</div>
                    <div className="text-slate-200 text-sm">
                        {stats.nonsense > 70 ? '“Working perfectly.”' : stats.universeCount === 0 ? '“Awaiting a poor decision.”' : '“Reality is holding up. Barely.”'}
                    </div>
                </div>
            </Panel>
        </div>
    );
}
