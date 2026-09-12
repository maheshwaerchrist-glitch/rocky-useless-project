import React, { useEffect, useMemo, useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { StatChip, BarMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { computeCoreStats, generateFinalReport, generateUniverses } from '../../lib/humor';
import { Sparkles, RotateCcw, Orbit, Zap } from 'lucide-react';

const USEFULNESS_STEPS = [10, 5, 2, 1, 0.1, 0.01, 0.0];

export default function FinalReport() {
    const { state, setActive, reset, addUniverses } = useMultiverse();
    const stats = useMemo(() => computeCoreStats(state), [state]);
    const report = useMemo(() => generateFinalReport(state, stats), [state, stats]);

    const [stepIdx, setStepIdx] = useState(0);
    const [showFinal, setShowFinal] = useState(false);

    useEffect(() => {
        setStepIdx(0); setShowFinal(false);
        const timers = [];
        USEFULNESS_STEPS.forEach((_, i) => {
            timers.push(setTimeout(() => setStepIdx(i + 1), 380 * (i + 1)));
        });
        timers.push(setTimeout(() => setShowFinal(true), 380 * (USEFULNESS_STEPS.length + 1)));
        return () => timers.forEach(clearTimeout);
    }, []);

    const spawnMore = () => {
        addUniverses(generateUniverses('One more, purely for research.', 3));
    };

    return (
        <Panel
            code="RPT · 010"
            title="Final Multiverse Dossier"
            subtitle="Cinematic summary of the current session. Suitable for framing. Not suitable for anything else."
            testId="panel-report"
            hot
        >
            <div className="rounded-xl border border-cyan-400/40 bg-gradient-to-br from-slate-950/80 to-slate-900/50 p-6 sm:p-8 relative overflow-hidden">
                <div className="scanline-overlay" />
                <div className="relative">
                    <div className="text-center mb-6">
                        <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">Multiverse Pro</div>
                        <div className="font-serif-display text-4xl sm:text-5xl text-white mt-1">Final Simulation Report</div>
                        <div className="divider-hot my-4 max-w-md mx-auto" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatChip label="Primary Reality" value={report.primaryReality} tone="violet" testId="rpt-primary" />
                        <StatChip label="Universes" value={report.universesGenerated} tone="cyan" testId="rpt-universes" />
                        <StatChip label="Temporal Interventions" value={report.temporalInterventions} tone="amber" testId="rpt-time" />
                        <StatChip label="Memory Integrity" value={report.memoryIntegrity} tone="rose" testId="rpt-memory" />
                        <StatChip label="Brain Weather" value={report.brainWeather} tone="cyan" testId="rpt-weather" />
                        <StatChip label="Classroom Stability" value={report.classroomStability} tone="amber" testId="rpt-class" />
                        <StatChip label="Logical Consistency" value={`${report.logicalConsistency}%`} tone="violet" testId="rpt-logic" />
                        <StatChip label="Reality Stability" value={`${report.realityStability}%`} tone="cyan" testId="rpt-reality" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <SubPanel title="Calculating Project Usefulness">
                            <div className="font-mono-tel space-y-1.5 min-h-[180px]" data-testid="usefulness-calc">
                                {USEFULNESS_STEPS.slice(0, stepIdx).map((v, i) => (
                                    <div key={i} className={`text-sm ${i === USEFULNESS_STEPS.length - 1 ? 'text-rose-400' : 'text-slate-300'} anim-fade-up`}>
                                        › {v.toFixed(v < 1 ? 3 : 0)}%
                                    </div>
                                ))}
                                {showFinal && (
                                    <div className="pt-4 anim-fade-up">
                                        <div className="text-xs text-muted-mv uppercase tracking-widest">Usefulness Confirmed</div>
                                        <div className="font-serif-display text-4xl text-rose-400 leading-none mt-1">Zero.</div>
                                    </div>
                                )}
                            </div>
                        </SubPanel>
                        <SubPanel title="Final System Conclusion">
                            <div className="space-y-4">
                                <div className="font-serif-display italic text-lg text-slate-100">"{report.conclusion}"</div>
                                {showFinal && (
                                    <div className="anim-fade-up">
                                        <div className="rounded-md border border-emerald-400/40 bg-emerald-500/5 p-3">
                                            <div className="font-mono-tel text-[10px] uppercase tracking-widest text-emerald-400">System Status</div>
                                            <div className="text-white font-serif-display text-xl mt-1">SUCCESSFULLY USELESS.</div>
                                            <div className="text-slate-400 text-xs mt-1">Multiverse Pro has achieved its objective. We spent all this technology to accomplish nothing.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SubPanel>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <button onClick={spawnMore} className="btn-mv btn-mv-solid" data-testid="rpt-generate">
                    <Sparkles size={14} /> Generate Another Universe
                </button>
                <button onClick={() => setActive('engine')} className="btn-mv btn-mv-violet" data-testid="rpt-run-again">
                    <Zap size={14} /> Run Complete System Again
                </button>
                <button onClick={() => { reset(); setActive('core'); }} className="btn-mv btn-mv-rose" data-testid="rpt-collapse">
                    <RotateCcw size={14} /> Collapse Current Reality
                </button>
                <button onClick={() => setActive('core')} className="btn-mv" data-testid="rpt-back">
                    <Orbit size={14} /> Return to Multiverse Core
                </button>
            </div>
        </Panel>
    );
}
