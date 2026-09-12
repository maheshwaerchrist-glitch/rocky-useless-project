import React, { useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { BarMeter, CircularMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { analyzeConversation } from '../../lib/humor';
import { MessageSquareText, RefreshCcw } from 'lucide-react';

export default function ConversationReplay() {
    const { addConversation } = useMultiverse();
    const [text, setText] = useState('');
    const [iteration, setIteration] = useState(0);
    const [result, setResult] = useState(null);

    const analyze = () => {
        const next = iteration + 1;
        const r = analyzeConversation(text || 'a very brief and forgettable exchange', next);
        setResult(r);
        setIteration(next);
        addConversation({ ...r, iteration: next, text });
    };

    const reset = () => { setText(''); setIteration(0); setResult(null); };

    return (
        <Panel
            code="CVR · 008"
            title="Conversation Replay & Overthinker"
            subtitle="Enter any past dialogue. The system will helpfully identify every possible way it could have gone worse."
            testId="panel-replay"
            hot
        >
            <div className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-5">
                <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80 mb-2">Conversation Transcript</div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder='e.g. "I saw them in the corridor and I said &apos;hi&apos; but too loud. Then I laughed for no reason."'
                    className="input-mv resize-none"
                    data-testid="replay-input"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={analyze} className="btn-mv btn-mv-solid" data-testid="replay-analyze">
                        <MessageSquareText size={14} /> {iteration === 0 ? 'Analyze Conversation' : 'Overthink Again'}
                    </button>
                    {iteration > 0 && (
                        <button onClick={reset} className="btn-mv" data-testid="replay-reset">Move On (Impossible)</button>
                    )}
                    {iteration > 0 && <span className="chip">Iteration · {iteration}</span>}
                </div>
            </div>

            {result && (
                <div className="mt-6 anim-fade-up rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <CircularMeter value={result.confidence} label="Confidence" color="#10b981" testId="replay-confidence" />
                        <CircularMeter value={result.awkwardness} label="Awkwardness" color="#f43f5e" testId="replay-awkwardness" />
                        <CircularMeter value={result.clarity} label="Clarity" color="#22d3ee" testId="replay-clarity" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <SubPanel title="Post-Hoc Analysis">
                            <div className="space-y-3">
                                <BarMeter value={result.overthinkingScore} label="Overthinking Score" color="#a855f7" />
                                <BarMeter value={result.rememberAt2am} label="P(Remembering at 2:00 AM)" color="#f59e0b" />
                                <BarMeter value={result.didntMatter} label="P(It Didn't Matter)" color="#22d3ee" />
                            </div>
                        </SubPanel>
                        <SubPanel title="Observations">
                            <div className="text-sm text-slate-300 space-y-2">
                                <div>Things you could have said better: <span className="font-mono-tel text-white">{result.betterSaid}</span></div>
                                <div className="italic font-serif-display text-slate-100">"{result.observation}"</div>
                            </div>
                        </SubPanel>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={analyze} className="btn-mv btn-mv-violet" data-testid="replay-again">
                            <RefreshCcw size={14} /> Overthink Again
                        </button>
                    </div>
                </div>
            )}
        </Panel>
    );
}