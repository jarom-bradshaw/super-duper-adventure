import { ReactNode } from 'react';

type GameOverlayProps = {
  title: string;
  description?: string;
  rules?: string[];
  controls?: string[];
  onStart: () => void;
  startLabel?: string;
  footer?: ReactNode;
};

export default function GameOverlay({ title, description, rules = [], controls = [], onStart, startLabel = 'Start', footer }: GameOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="glass-card rounded-lg p-6 max-w-md w-[90%] text-[color:var(--text)]">
        <h2 className="text-2xl font-bold mb-2 gradient-text">{title}</h2>
        {description && <p className="mb-3 text-[color:var(--muted-foreground)]">{description}</p>}
        {!!rules.length && (
          <div className="mb-3">
            <h3 className="font-semibold mb-1">Rules</h3>
            <ul className="list-disc list-inside text-[color:var(--muted-foreground)]">
              {rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        {!!controls.length && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Controls</h3>
            <ul className="list-disc list-inside text-[color:var(--muted-foreground)]">
              {controls.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--text)] hover:bg-[color:var(--glass-bg)]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link)]"
        >
          {startLabel}
        </button>
        {footer && <div className="mt-3 text-sm text-[color:var(--muted-foreground)]">{footer}</div>}
      </div>
    </div>
  );
}


