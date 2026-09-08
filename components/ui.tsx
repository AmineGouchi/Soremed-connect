import { ArrowUpRight, Check, Minus, Plus } from "lucide-react";

/** Original artwork on dark surfaces; its exact alpha silhouette in brand green on light surfaces. */
export function OfficialLogo({ surface = "light", decorative = false, className = "" }: { surface?: "light" | "dark"; decorative?: boolean; className?: string }) {
  return <span className={`official-logo ${className}`} data-surface={surface} aria-hidden={decorative || undefined}>
    <img src="/branding/SOREMED.png" alt={decorative ? "" : "SOREMED"} width="2501" height="2688" draggable={false} />
  </span>;
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="wordmark" data-surface={light ? "dark" : "light"}>
      <OfficialLogo surface={light ? "dark" : "light"} />
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <span className="eyebrow">{children}</span>;
  const normalized = children.toLocaleLowerCase("fr-FR").replace(/\b(soremed|b2b|bl|if|ice)\b/gi, (value) => value.toUpperCase());
  const readable = normalized.replace(/(^|[\/·])\s*([a-zà-ÿ])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);
  return <span className="eyebrow">{readable}</span>;
}

export function Button({
  children,
  variant = "primary",
  small = false,
  className = "",
  type = "button",
  onClick,
  disabled = false,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  small?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${small ? "btn-small" : ""} ${className}`} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function StatusBadge({ status, children }: { status: "success" | "warning" | "error" | "info" | "neutral"; children: React.ReactNode }) {
  return <span className={`status-badge status-${status}`}>{children}</span>;
}

export function QuantitySelector({ value, onDecrease, onIncrease }: { value: number; onDecrease: () => void; onIncrease: () => void }) {
  return (
    <span className="quantity-control" aria-label="Quantité">
      <button type="button" aria-label="Réduire la quantité" onClick={onDecrease}><Minus size={13} /></button>
      <span>{value}</span>
      <button type="button" aria-label="Augmenter la quantité" onClick={onIncrease}><Plus size={13} /></button>
    </span>
  );
}

export function ArrowButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button type="button" className="card-link" onClick={onClick}>{children} <ArrowUpRight size={13} /></button>;
}

export function CheckMark() {
  return <span className="step-check"><Check size={10} /></span>;
}
