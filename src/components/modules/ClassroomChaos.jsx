import React, { useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { CircularMeter, BarMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { CLASSROOM_SITUATIONS, computeClassroomChaos } from '../../lib/humor';

export default function ClassroomChaos() {
    const { addClassroom } = useMultiverse();
    const [selected, setSelected] = useState([]);
    const [result, setResult] = useState(null);

    const toggle = (id) => {
        setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    };

    const run = () => {
        const r = computeClassroomChaos(selected);
        setResult(r);
        addClassroom(r);
    };

    return (
        <Panel
            code="CHX · 006"
            title="Classroom Chaos Matrix"
            subtitle="Select the situations currently unfolding. The Matrix will compute chaos, productivity loss, and probability that someone says 'Sir hasn't come yet.'"
            testId="panel-chaos"
            hot
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CLASSROOM_SITUATIONS.map((s) => {
                    const on = selected.includes(s.id);
                    return (
                        <button
                            key={s.id}
                            onClick={() => toggle(s.id)}
                            data-testid={`chaos-opt-${s.id}`}
                            className={`text-left px-4 py-3 rounded-lg border transition text-sm ${
                                on
                                    ? 'border-cyan-400/70 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                                    : 'border-slate-700/50 text-slate-300 hover:border-cyan-400/40 hover:bg-slate-800/40'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${on ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-600'}`} />
                                {s.label}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 flex gap-2 flex-wrap">
                <button onClick={run} disabled={selected.length === 0} className="btn-mv btn-mv-solid" data-testid="chaos-run">Compute Chaos</button>
                <button onClick={() => { setSelected([]); setResult(null); }} className="btn-mv" data-testid="chaos-clear">Clear</button>
            </div>

            {result && (
                <div className="mt-6 anim-fade-up rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <CircularMeter value={result.chaos} label="Chaos" color="#f43f5e" testId="chaos-chaos" />
                        <CircularMeter value={result.productivity} label="Productivity" color="#10b981" testId="chaos-productivity" />
                        <CircularMeter value={result.confusion} label="Confusion" color="#a855f7" testId="chaos-confusion" />
                        <CircularMeter value={result.teacherPatience} label="Teacher Patience" color="#22d3ee" testId="chaos-patience" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SubPanel title="Live Readings">
                            <div className="space-y-3">
                                <BarMeter value={result.studentEnergy} label="Student Energy" color="#f59e0b" />
                                <BarMeter value={result.actualLearning} label="Actual Learning" color="#10b981" />
                                <BarMeter value={result.sirNotComeProb} label="P('Sir hasn't come yet')" color="#22d3ee" />
                            </div>
                        </SubPanel>
                        <SubPanel title="Field Report">
                            <div className="text-sm text-slate-300 space-y-2">
                                <div>Teacher delay: <span className="font-mono-tel text-white">{result.teacherDelay} min</span></div>
                                <div className="italic font-serif-display text-slate-100">
                                    {result.chaos > 70 ? '"Total system meltdown. Snacks are being consumed."' :
                                     result.chaos > 45 ? '"Chaotic, but functional. Someone is asking for the notes."' :
                                     '"Suspiciously calm. Something is about to happen."'}
                                </div>
                            </div>
                        </SubPanel>
                    </div>
                </div>
            )}
        </Panel>
    );
}
