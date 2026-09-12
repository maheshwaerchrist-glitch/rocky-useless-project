import React, { useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { useMultiverse } from '../../context/MultiverseContext';
import { TIME_CHOICES, generateTimeOutcome, generateUniverses } from '../../lib/humor';
import { Clock, Rewind } from 'lucide-react';

export default function TimeMachine() {
    const { addTime, addUniverses } = useMultiverse();
    const [decision, setDecision] = useState('');
    const [phase, setPhase] = useState('idle'); // idle | scanning | choose | done
    const [countdown, setCountdown] = useState(10);
    const [outcome, setOutcome] = useState(null);

    const start = async () => {
        if (!decision.trim()) return;
        setPhase('scanning');
        for (let n = 10; n >= 0; n--) {
            setCountdown(n);
            await new Promise(r => setTimeout(r, n > 5 ? 150 : 260));
        }
        setPhase('choose');
    };

    const pick = (choice) => {
        const o = generateTimeOutcome(choice.id, decision);
        setOutcome({ ...o, choice });
        addTime({ decision, choice: choice.id, ...o });
        // Also spawn a related universe
        const u = generateUniverses(`Time-machine variant of: ${decision}`, 1)[0];
        u.id = o.newUniverseId;
        addUniverses([u]);
        setPhase('done');
    };

    const reset = () => { setPhase('idle'); setOutcome(null); setDecision(''); setCountdown(10); };

    return (
        <Panel
            code="TMX · 007"
            title="Stupid Decision Time Machine"
            subtitle="Isolates a moment of regret and returns you to it. Warning: the universe will not intervene on your behalf."
            testId="panel-time"
            hot
        >
            {phase === 'idle' && (
                <div className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6">
                    <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">Target Decision</div>
                    <input
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && start()}
                        placeholder="e.g. I should have studied yesterday."
                        className="input-mv mt-2"
                        data-testid="time-input"
                    />
                    <button onClick={start} disabled={!decision.trim()} className="btn-mv btn-mv-solid mt-4" data-testid="time-scan">
                        <Rewind size={14} /> Initiate Temporal Scan
                    </button>
                </div>
            )}

            {phase === 'scanning' && (
                <div className="rounded-xl border border-cyan-400/40 bg-slate-950/60 p-10 flex flex-col items-center anim-fade-in">
                    <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">Temporal Scan Initiated</div>
                    <div className="mt-4 font-serif-display text-8xl text-white leading-none tabular-nums anim-flicker" data-testid="time-countdown">
                        T-{countdown}
                    </div>
                    <div className="mt-4 text-slate-400 text-xs uppercase tracking-widest font-mono-tel">seconds backward</div>
                    <div className="mt-6 w-full max-w-md h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${((10 - countdown) / 10) * 100}%`, transition: 'width 200ms' }} />
                    </div>
                </div>
            )}

            {phase === 'choose' && (
                <div className="anim-fade-up">
                    <div className="rounded-xl border border-amber-400/40 bg-amber-500/5 p-5">
                        <div className="font-mono-tel text-[10px] uppercase tracking-widest text-amber-300">Temporal Destination Reached</div>
                        <div className="font-serif-display text-2xl text-white mt-1">Warning: You are about to make the exact same decision again.</div>
                        <div className="text-slate-300 text-sm mt-1 italic">"{decision}"</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                        {TIME_CHOICES.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => pick(c)}
                                data-testid={`time-choice-${c.id}`}
                                className={`btn-mv justify-center py-4 ${c.tone === 'rose' ? 'btn-mv-rose' : c.tone === 'violet' ? 'btn-mv-violet' : ''}`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {phase === 'done' && outcome && (
                <div className="anim-fade-up rounded-xl border border-cyan-400/40 bg-slate-950/50 p-6">
                    <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">Temporal Outcome · Anomaly #{outcome.anomaly}</div>
                    <div className="font-serif-display text-2xl text-white mt-1">"{outcome.summary}"</div>
                    <div className="divider-hot my-4" />
                    <div className="text-slate-300 text-sm">
                        A new universe was spawned as a side-effect: <span className="font-mono-tel text-cyan-mv">#{outcome.newUniverseId}</span>
                    </div>
                    <div className="mt-6 flex gap-2 flex-wrap">
                        <button onClick={reset} className="btn-mv btn-mv-solid" data-testid="time-again">
                            <Clock size={14} /> Alter Another Regret
                        </button>
                    </div>
                </div>
            )}
        </Panel>
    );
}
