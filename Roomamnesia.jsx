import React, { useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { CircularMeter, BarMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { computeRoomAmnesia, getAmnesiaAnswers } from '../../lib/humor';
import { DoorOpen, DoorClosed } from 'lucide-react';

export default function RoomAmnesia() {
    const { addRoomAmnesia } = useMultiverse();
    const [entered, setEntered] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [result, setResult] = useState(null);

    const enter = () => { setEntered(true); setAnswer(null); setResult(null); };
    const submit = (a) => {
        setAnswer(a);
        const r = computeRoomAmnesia(a.id);
        setResult(r);
        addRoomAmnesia(r);
    };
    const reset = () => { setEntered(false); setAnswer(null); setResult(null); };

    return (
        <Panel
            code="AMN · 005"
            title="Room Amnesia Engine"
            subtitle="Simulates crossing a threshold and immediately losing all sense of purpose. Feeds Confusion into Brain Weather."
            testId="panel-amnesia"
            hot
        >
            {!entered ? (
                <div className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-10 flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 rounded-full flex items-center justify-center anim-pulse-glow border border-cyan-400/50 mb-6">
                        <DoorClosed size={38} className="text-cyan-mv" />
                        <div className="absolute inset-0 rounded-full border border-cyan-400/30 anim-ring-rotate" />
                    </div>
                    <div className="font-serif-display text-3xl text-white">The doorway awaits.</div>
                    <p className="text-slate-400 text-sm mt-2 max-w-md">
                        Once inside, you will forget precisely why you entered. This is a well-established phenomenon.
                    </p>
                    <button onClick={enter} className="btn-mv btn-mv-solid mt-8" data-testid="enter-room-button">
                        <DoorOpen size={14} /> Enter Room
                    </button>
                </div>
            ) : !result ? (
                <div className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6 anim-fade-up">
                    <div className="text-center mb-6">
                        <div className="font-mono-tel text-[10px] uppercase tracking-widest text-emerald-400">Room Entered</div>
                        <div className="font-serif-display text-3xl text-white mt-2">Why are you here?</div>
                        <div className="text-slate-400 text-xs mt-1">Select an answer. There are no correct answers.</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {getAmnesiaAnswers().map((a) => (
                            <button
                                key={a.id}
                                onClick={() => submit(a)}
                                data-testid={`amnesia-answer-${a.id}`}
                                className="text-left px-4 py-3 rounded-lg border border-slate-700/50 hover:border-cyan-400/70 hover:bg-cyan-500/5 transition"
                            >
                                <span className="text-slate-200 text-sm">{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="anim-fade-up">
                    <div className="rounded-xl border border-cyan-500/15 bg-slate-950/50 p-6">
                        <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">Amnesia Analysis</div>
                        <div className="font-serif-display text-2xl text-white mt-1">"{answer.label}"</div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
                            <CircularMeter value={result.purposeDetection} label="Purpose Detection" color="#a855f7" testId="amnesia-purpose" />
                            <CircularMeter value={result.memoryStability} label="Memory Stability" color="#22d3ee" testId="amnesia-memory" />
                            <CircularMeter value={result.confusion} label="Confusion" color="#f43f5e" testId="amnesia-confusion" />
                            <CircularMeter value={result.returnProbability} label="Return-to-Previous-Room" color="#f59e0b" testId="amnesia-return" />
                        </div>

                        <SubPanel title="Final Conclusion" className="mt-6">
                            <div className="font-serif-display italic text-lg text-slate-100">"{result.conclusion}"</div>
                        </SubPanel>

                        <div className="mt-6 flex gap-2 flex-wrap">
                            <button onClick={enter} className="btn-mv" data-testid="amnesia-again">Enter Another Room</button>
                            <button onClick={reset} className="btn-mv btn-mv-violet" data-testid="amnesia-reset">Return to Doorway</button>
                        </div>
                    </div>
                </div>
            )}
        </Panel>
    );
}
