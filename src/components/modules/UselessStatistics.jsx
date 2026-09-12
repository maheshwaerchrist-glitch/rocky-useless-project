import React, { useMemo } from 'react';
import { Panel, SubPanel } from '../Panel';
import { StatChip, BarMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { computeCoreStats } from '../../lib/humor';

export default function UselessStatistics() {
    const { state } = useMultiverse();
    const stats = useMemo(() => computeCoreStats(state), [state]);

    return (
        <Panel
            code="STX · 009"
            title="Useless Statistics Engine"
            subtitle="Aggregates every ridiculously precise measurement collected across all subsystems. Absolutely none of it is actionable."
            testId="panel-stats"
            hot
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <StatChip label="Universes Generated" value={stats.universeCount} tone="cyan" testId="stx-universes" />
                <StatChip label="Useful Conclusions" value={0} tone="rose" testId="stx-useful" />
                <StatChip label="Decisions Reconsidered" value={stats.decisionsReconsidered} tone="violet" testId="stx-decisions" />
                <StatChip label="Rooms Forgotten" value={stats.roomsForgotten} tone="amber" testId="stx-rooms" />
                <StatChip label="Classrooms Simulated" value={stats.classroomSims} tone="cyan" testId="stx-classrooms" />
                <StatChip label="Conversations Analyzed" value={stats.conversations} tone="violet" testId="stx-convs" />
                <StatChip label="Overthinking Detected" value={stats.overthinks} tone="rose" testId="stx-overthinks" />
                <StatChip label="Temporal Anomalies" value={stats.anomalies} tone="amber" testId="stx-anomalies" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <SubPanel title="Multiverse Health">
                    <div className="space-y-3">
                        <BarMeter value={stats.realityIntegrity} label="Reality Integrity" color="#22d3ee" />
                        <BarMeter value={stats.causalStability} label="Causal Stability" color="#a855f7" />
                        <BarMeter value={stats.logicalConsistency} label="Logical Consistency" color="#f59e0b" />
                        <BarMeter value={stats.nonsense} label="Nonsense Levels" color="#f43f5e" />
                    </div>
                </SubPanel>
                <SubPanel title="Verdict">
                    <div className="space-y-2 text-sm text-slate-300">
                        <div>Overthinking rating: <span className="font-mono-tel text-white">{stats.overthinks > 6 ? 'HIGH' : stats.overthinks > 2 ? 'ELEVATED' : 'MILD'}</span></div>
                        <div>Actual usefulness: <span className="font-mono-tel text-white">0.000%</span></div>
                        <div className="italic font-serif-display text-slate-100 pt-2">
                            "The engine confirms: this data is meticulously accurate and entirely irrelevant."
                        </div>
                    </div>
                </SubPanel>
            </div>

            <div className="mt-6 rounded-lg border border-slate-700/40 bg-slate-950/40 p-4">
                <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80 mb-3">Recent Feed</div>
                <ul className="space-y-1.5 text-xs font-mono-tel">
                    {state.universes.slice(0, 3).map((u, i) => (
                        <li key={`u-${u.id}-${i}`} className="text-slate-400">› Universe #{u.id} rendered. Probability {u.probability}%.</li>
                    ))}
                    {state.roomAmnesia.slice(0, 2).map((r, i) => (
                        <li key={`r-${i}`} className="text-slate-400">› Room forgotten. Purpose detection {r.purposeDetection}%.</li>
                    ))}
                    {state.classroomRuns.slice(0, 2).map((r, i) => (
                        <li key={`c-${i}`} className="text-slate-400">› Classroom chaos measured at {r.chaos}%.</li>
                    ))}
                    {state.conversations.slice(0, 2).map((c, i) => (
                        <li key={`conv-${i}`} className="text-slate-400">› Conversation overthought (iteration {c.iteration}).</li>
                    ))}
                    {state.timeInterventions.slice(0, 2).map((t, i) => (
                        <li key={`t-${i}`} className="text-slate-400">› Temporal intervention. Anomaly #{t.anomaly}.</li>
                    ))}
                    {state.universes.length + state.roomAmnesia.length + state.classroomRuns.length + state.conversations.length + state.timeInterventions.length === 0 && (
                        <li className="text-slate-600 italic">no events logged yet. that is, in itself, an event.</li>
                    )}
                </ul>
            </div>
        </Panel>
    );
}