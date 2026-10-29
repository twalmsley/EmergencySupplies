import { ChevronDown, ChevronRight } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

type Props = {
  title: string;
  badge?: string | number;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

export function CollapsiblePanel({
  title,
  badge,
  defaultOpen = false,
  children,
  className = '',
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const headerId = useId();

  return (
    <div className={`panel side-panel collapsible-panel no-print ${className}`.trim()}>
      <button
        type="button"
        id={headerId}
        className="collapsible-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="collapsible-toggle-main">
          {open ? (
            <ChevronDown size={18} aria-hidden="true" />
          ) : (
            <ChevronRight size={18} aria-hidden="true" />
          )}
          <span className="collapsible-title">{title}</span>
          {badge !== undefined && badge !== '' && (
            <span className="badge">{badge}</span>
          )}
        </span>
        <span className="muted">{open ? 'Collapse' : 'Expand'}</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        className="collapsible-body"
      >
        {children}
      </div>
    </div>
  );
}
