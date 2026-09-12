import React, { useEffect, useState } from 'react';
import { BOOT_LINES } from '../lib/humor';
import { useMultiverse } from '../context/MultiverseContext';
import * as sfx from '../lib/audio';
import { Volume2, VolumeX, Zap } from 'lucide-react';

export default function Landing({ onEnter }) {
    const { state, setAudio } = useMultiverse();
    const [step, setStep] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (step >= BOOT_LINES.length) { setReady(true); return; }
        const t = setTimeout(() => { sfx.tick(); setStep((s) => s + 1); }, 260 + Math.random() * 220);
        return () => clearTimeout(t);
    }, [step]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 relative">
            <button
                onClick={() => setAudio(!state.audioOn)}
                data-testid="landing-audio-toggle"
                className="absolute top-6 right-6 chip hover:text-white hover:border-cyan-400/60 transition"
                title={state.audioOn ? 'Mute ambient audio' : 'Enable ambient audio'}
            >
                {state.audioOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
                <span>{state.audioOn ? 'Audio · On' : 'Audio · Off'}</span>
            </button>

            <div className="absolute top-6 left-6 chip">
                <span className="node-dot" style={{ width: 6, height: 6 }} />
                <span>MVP · Build 2077.03.14</span>
            </div>

            <div className="w-full max-w-4xl flex flex-col items-center text-center anim-fade-in">
                <div className="chip mb-6 border-violet-400/40 text-violet-300">
                    <Zap size={12} />
                    <span>Classified · Absolutely Pointless Research</span>
                </div>

                <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-white">
                    MULTIVERSE <em className="text-cyan-mv not-italic">PRO</em>
                </h1>
                <p className="mt-5 max-w-xl text-slate-300 text-base sm:text-lg font-serif-display italic">
                    "Explore the lives you could have lived… for absolutely no reason."
                </p>

                <div className="mt-12 w-full max-w-xl text-left glass rounded-xl p-6 crosshair-corners">
                    <span className="ch-a" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">System Initialization</span>
                        <span className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv">{Math.min(step, BOOT_LINES.length)} / {BOOT_LINES.length}</span>
                    </div>
                    <ul className="space-y-2">
                        {BOOT_LINES.map((line, i) => {
                            const done = i < step;
                            const active = i === step;
                            return (
                                <li key={line.key} className="flex items-center justify-between font-mono-tel text-xs">
                                    <span className={done ? 'text-slate-200' : 'text-slate-500'}>
                                        <span className="text-cyan-mv/70 mr-2">›</span>
                                        {line.label}
                                        <span className="text-slate-600 mx-2">{'.'.repeat(Math.max(4, 34 - line.label.length))}</span>
                                    </span>
                                    <span className={done ? 'status-online' : active ? 'text-cyan-mv anim-flicker' : 'text-slate-600'}>
                                        {done ? 'ONLINE' : active ? 'BOOT…' : 'PENDING'}
                                    </span>
                                </li>
                            );
                        })}
                        <li className="flex items-center justify-between font-mono-tel text-xs pt-3 border-t border-slate-700/40 mt-3">
                            <span className="text-slate-400">› Overall Usefulness</span>
                            <span className="status-crit">0.000 %</span>
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => { sfx.chord(); onEnter(); }}
                    disabled={!ready}
                    data-testid="enter-multiverse-button"
                    className="btn-mv btn-mv-solid mt-10 text-sm px-8 py-3.5 disabled:opacity-40"
                >
                    {ready ? '⟶ Enter Multiverse' : (
                        <>
                            <span>Initializing</span>
                            <span className="dot-load"><span /><span /><span /></span>
                        </>
                    )}
                </button>

                <p className="mt-8 text-[11px] text-dim-mv font-mono-tel uppercase tracking-widest max-w-md">
                    Warning: contains highly precise, entirely unnecessary calculations.
                </p>
            </div>
        </div>
    );
}