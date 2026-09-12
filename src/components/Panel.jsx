import React from 'react';

export function Panel({ children, className = '', hot = false, title, subtitle, code, right, testId }) {
    return (
        <section
            className={`relative rounded-xl glass crosshair-corners ${hot ? 'glass-hot' : ''} ${className}`}
            data-testid={testId}
        >
            <span className="ch-a" />
            {(title || right) && (
                <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
                    <div>
                        {code && <div className="font-mono-tel text-[10px] uppercase tracking-[0.22em] text-cyan-mv/80 mb-1">{code}</div>}
                        {title && <h2 className="font-serif-display text-2xl text-white tracking-tight">{title}</h2>}
                        {subtitle && <p className="text-xs text-muted-mv mt-1 max-w-lg">{subtitle}</p>}
                    </div>
                    {right}
                </header>
            )}
            {title && <div className="divider-hot mx-6" />}
            <div className="p-6">{children}</div>
        </section>
    );
}

export function SubPanel({ children, className = '', title, testId }) {
    return (
        <div className={`rounded-lg border border-cyan-500/15 bg-slate-950/40 p-4 ${className}`} data-testid={testId}>
            {title && <div className="font-mono-tel text-[10px] uppercase tracking-widest text-cyan-mv/80 mb-3">{title}</div>}
            {children}
        </div>
    );
}
