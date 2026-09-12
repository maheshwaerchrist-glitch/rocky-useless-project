import React from 'react';

export function CircularMeter({ value = 0, label = '', size = 96, color = '#22d3ee', suffix = '%', testId }) {
    const stroke = 6;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const clamped = Math.max(0, Math.min(100, value));
    const offset = c - (clamped / 100) * c;
    return (
        <div className="flex flex-col items-center gap-2" data-testid={testId}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(148,163,184,0.12)" strokeWidth={stroke} fill="none" />
                    <circle
                        cx={size / 2} cy={size / 2} r={r}
                        stroke={color} strokeWidth={stroke} fill="none"
                        strokeDasharray={c} strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 6px ${color}66)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-mono-tel text-xl font-bold text-white leading-none">{Math.round(clamped)}<span className="text-xs text-muted-mv ml-0.5">{suffix}</span></div>
                </div>
            </div>
            {label && <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80">{label}</div>}
        </div>
    );
}

export function BarMeter({ value = 0, label = '', color = '#22d3ee', suffix = '%', testId }) {
    const clamped = Math.max(0, Math.min(100, value));
    return (
        <div className="w-full" data-testid={testId}>
            <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv">{label}</span>
                <span className="font-mono-tel text-sm font-semibold text-white">{Math.round(clamped)}<span className="text-xs text-dim-mv">{suffix}</span></span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800/70 overflow-hidden border border-slate-700/40">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${clamped}%`,
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                        boxShadow: `0 0 12px ${color}66`,
                        transition: 'width 900ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                />
            </div>
        </div>
    );
}

export function StatChip({ label, value, tone = 'cyan', testId }) {
    const colorMap = { cyan: 'text-cyan-mv border-cyan-400/40', violet: 'text-violet-mv border-violet-400/40', emerald: 'text-emerald-400 border-emerald-400/40', amber: 'text-amber-400 border-amber-400/40', rose: 'text-rose-400 border-rose-400/40' };
    return (
        <div className={`glass rounded-md p-3 border ${colorMap[tone] || colorMap.cyan}`} data-testid={testId}>
            <div className="font-mono-tel text-[10px] uppercase tracking-widest text-muted-mv mb-1">{label}</div>
            <div className={`font-mono-tel text-xl font-bold ${colorMap[tone]?.split(' ')[0] || 'text-cyan-mv'}`}>{value}</div>
        </div>
    );
}