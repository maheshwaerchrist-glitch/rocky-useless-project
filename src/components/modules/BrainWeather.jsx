import React, { useMemo, useState } from 'react';
import { Panel, SubPanel } from '../Panel';
import { BarMeter, CircularMeter } from '../Meter';
import { useMultiverse } from '../../context/MultiverseContext';
import { computeBrainWeather, computeCoreStats } from '../../lib/humor';
import { CloudLightning, CloudRain, CloudFog, Wind, CloudSun, Sun, Zap, SatelliteDish } from 'lucide-react';

const ICON_MAP = {
    'cloud-lightning': CloudLightning,
    'cloud-rain': CloudRain,
    'cloud-fog': CloudFog,
    'wind': Wind,
    'cloud-sun': CloudSun,
    'sun': Sun,
    'zap': Zap,
    'satellite-dish': SatelliteDish,
};

export default function BrainWeather() {
    const { state, setBrainWeather } = useMultiverse();
    const stats = useMemo(() => computeCoreStats(state), [state]);
    const [inputs, setInputs] = useState({ sleep: 6, tasks: 4, classes: 3, phoneChecks: 40, embarrassing: 2 });

    const chaosLevel = stats.chaosAvg;
    const confusion = stats.confusionAvg;
    const overthinking = Math.min(99, stats.overthinks * 8);

    const result = useMemo(
        () => computeBrainWeather({ ...inputs, chaosLevel, overthinking, confusion }),
        [inputs, chaosLevel, overthinking, confusion]
    );

    const applyResult = () => setBrainWeather(result);

    const Icon = ICON_MAP[result.condition.icon] || CloudLightning;
    const toneColor = { crit: '#f43f5e', warn: '#f59e0b', online: '#10b981' }[result.condition.tone] || '#22d3ee';

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Panel
                className="xl:col-span-2"
                code="BWX · 004"
                title="Brain Weather Diagnostic"
                subtitle="Cognitive atmospheric conditions computed from vitals, task load, and interference from other subsystems."
                testId="panel-weather"
                hot
            >
                <div className="rounded-xl border overflow-hidden relative"
                    style={{ borderColor: `${toneColor}55`, background: `radial-gradient(circle at 30% 30%, ${toneColor}22, transparent 60%)` }}
                >
                    <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full border flex items-center justify-center anim-pulse-glow" style={{ borderColor: `${toneColor}80`, boxShadow: `0 0 30px ${toneColor}44` }}>
                                <Icon size={44} color={toneColor} />
                            </div>
                            <div className="absolute inset-0 rounded-full border anim-ring-rotate" style={{ borderColor: `${toneColor}33` }} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv">Current Condition</div>
                            <div className="font-serif-display text-3xl sm:text-4xl text-white tracking-tight mt-1" data-testid="weather-condition">
                                {result.condition.label}
                            </div>
                            <div className="text-slate-300 text-sm mt-2">
                                Operational Capacity: <span className="font-mono-tel text-white">{result.operationalCapacity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
                    <CircularMeter value={result.focus} label="Focus" color="#22d3ee" testId="weather-focus" />
                    <CircularMeter value={result.stress} label="Stress" color="#f59e0b" testId="weather-stress" />
                    <CircularMeter value={result.overthinking} label="Overthinking" color="#a855f7" testId="weather-overthink" />
                    <CircularMeter value={result.confusion} label="Confusion" color="#f43f5e" testId="weather-confusion" />
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={applyResult} className="btn-mv" data-testid="weather-apply">Log to Core</button>
                </div>
            </Panel>

            <Panel code="BWX · CAL" title="Cognitive Inputs" subtitle="Adjust to update the mental forecast." testId="panel-weather-inputs">
                <div className="space-y-5">
                    {[
                        { key: 'sleep', label: 'Sleep (hrs)', min: 0, max: 12, step: 0.5 },
                        { key: 'tasks', label: 'Pending Tasks', min: 0, max: 20, step: 1 },
                        { key: 'classes', label: 'Classes Today', min: 0, max: 12, step: 1 },
                        { key: 'phoneChecks', label: 'Phone Checks', min: 0, max: 200, step: 5 },
                        { key: 'embarrassing', label: 'Embarrassing Memories', min: 0, max: 20, step: 1 },
                    ].map((f) => (
                        <div key={f.key}>
                            <div className="flex justify-between mb-1.5">
                                <span className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv">{f.label}</span>
                                <span className="font-mono-tel text-sm text-white">{inputs[f.key]}</span>
                            </div>
                            <input
                                type="range"
                                min={f.min} max={f.max} step={f.step}
                                value={inputs[f.key]}
                                data-testid={`weather-input-${f.key}`}
                                onChange={(e) => setInputs((s) => ({ ...s, [f.key]: parseFloat(e.target.value) }))}
                                className="w-full accent-cyan-400"
                            />
                        </div>
                    ))}
                    <SubPanel title="Cross-System Interference" className="mt-2">
                        <div className="space-y-2">
                            <BarMeter value={chaosLevel} label="Classroom Bleed-through" color="#f59e0b" />
                            <BarMeter value={confusion} label="Amnesia Residue" color="#a855f7" />
                            <BarMeter value={overthinking} label="Replay Loops" color="#f43f5e" />
                        </div>
                    </SubPanel>
                </div>
            </Panel>
        </div>
    );
}
