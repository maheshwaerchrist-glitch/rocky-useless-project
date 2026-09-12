import React, { useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { BarMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { generateUniverses, computeCoreStats, randomLoadingLine } from '../../lib/humor';
import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
    'What if I had gone to the other classroom?',
    'What if I studied yesterday?',
    'What if I had stayed home?',
    'What if I took the other route?',
    'What if I opened my phone instead?',
];

export default function MultiverseEngine() {
    const { state, addUniverses } = useMultiverse();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingLine, setLoadingLine] = useState('');

    const stats = computeCoreStats(state);

    const run = async () => {
        const decision = input.trim() || SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
        setLoading(true);
        setLoadingLine(randomLoadingLine());
        await new Promise((r) => setTimeout(r, 900));
        const created = generateUniverses(decision, 4, { chaos: stats.chaosAvg });
        addUniverses(created);
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <Panel
                code="ENG · 003"
                title="Multiverse Decision Engine"
                subtitle="Provide any ordinary, minor, or agonisingly trivial decision. The engine will render 4 alternate timelines with elaborate uselessness."
                testId="panel-engine"
                hot
            >
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. What if I had studied yesterday?"
                        className="input-mv"
                        data-testid="engine-input"
                        onKeyDown={(e) => e.key === 'Enter' && !loading && run()}
                    />
                    <button onClick={run} disabled={loading} className="btn-mv btn-mv-solid whitespace-nowrap" data-testid="engine-run">
                        <Sparkles size={14} /> {loading ? 'Simulating…' : 'Simulate Universes'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {SUGGESTIONS.map((s) => (
                        <button key={s} onClick={() => setInput(s)} className="chip hover:border-cyan-400/60 hover:text-white transition" data-testid={`suggest-${s.slice(0, 8)}`}>
                            {s}
                        </button>
                    ))}
                </div>
                {loading && (
                    <div className="mt-4 font-mono-tel text-[11px] uppercase tracking-widest text-cyan-mv/80 flex items-center gap-3">
                        <span className="dot-load"><span /><span /><span /></span>
                        <span>{loadingLine}</span>
                    </div>
                )}
            </Panel>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {state.universes.length === 0 ? (
                    <Panel testId="panel-empty" className="lg:col-span-2">
                        <div className="text-center py-16">
                            <div className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv mb-2">Awaiting Input</div>
                            <div className="font-serif-display text-2xl text-white">No universes have been rendered yet.</div>
                            <div className="text-slate-400 text-sm mt-2">Provide a decision above. Any decision. Even a bad one.</div>
                        </div>
                    </Panel>
                ) : state.universes.map((u, i) => (
                    <article key={`${u.id}-${i}`} className="glass rounded-xl p-5 crosshair-corners anim-fade-up" style={{ animationDelay: `${(i % 4) * 90}ms` }} data-testid={`universe-${u.id}`}>
                        <span className="ch-a" />
                        <div className="flex items-baseline justify-between gap-2">
                            <div>
                                <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">Universe</div>
                                <div className="font-serif-display text-3xl text-white leading-none mt-1">#{u.id}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv">Probability</div>
                                <div className="font-mono-tel text-lg text-cyan-mv font-bold">{u.probability}%</div>
                            </div>
                        </div>
                        <div className="divider-hot my-3" />
                        <div className="text-slate-300 text-sm mb-2 italic">{u.decision}</div>
                        <div className="text-slate-100 text-base font-serif-display leading-snug">"{u.outcome}"</div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <BarMeter value={u.stability} label="Reality Stability" color="#22d3ee" />
                            <BarMeter value={u.probability} label="Timeline Weight" color="#a855f7" />
                        </div>
                        <SubPanel title="Butterfly Effect" className="mt-4">
                            <div className="text-slate-300 text-xs">{u.butterfly}</div>
                        </SubPanel>
                        <SubPanel title="Unnecessary Consequence" className="mt-2">
                            <div className="text-slate-300 text-xs">{u.consequence}</div>
                        </SubPanel>
                        <div className="mt-3 text-[11px] text-cyan-mv/70 italic">{u.observation}</div>
                    </article>
                ))}
            </div>
        </div>
    );
}
