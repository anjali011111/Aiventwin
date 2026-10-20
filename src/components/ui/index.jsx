import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, FlaskConical } from 'lucide-react';

/* ---------- Button ---------- */
const variants = {
  primary: 'btn-brand',                       // exact brand gradient — primary CTAs only
  cyan: 'btn-brand',                          // legacy aliases → same primary style
  blue: 'btn-brand',
  success: 'bg-ok text-white hover:brightness-95',
  outline: 'border border-line bg-white text-navy hover:bg-tint',
  ghost: 'text-navy hover:bg-tint',
  glass: 'border border-line bg-white text-navy hover:bg-tint',
};
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };

export function Button({ variant = 'primary', size = 'md', to, className = '', children, ...props }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

/* ---------- Card ---------- */
export function Card({ className = '', bare = false, children, ...props }) {
  // bare: no surface at all (used where the content should sit directly on the page, e.g. the body model)
  return <div className={`${bare ? '' : 'card'} ${className}`} {...props}>{children}</div>;
}

/* ---------- Badge ---------- */
const tones = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warn: 'bg-amber-50 text-amber-700 border-amber-200',
  risk: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-tint text-brand-4 border-brand-1',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  navy: 'bg-tint text-brand-4 border-brand-1',
};
export function Badge({ tone = 'neutral', className = '', children }) {
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>;
}

/* ---------- Synthetic-data notice (used everywhere demo data appears) ---------- */
export function SyntheticTag({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border border-brand-1 bg-tint px-2 py-0.5 text-[11px] font-semibold text-brand-4 ${className}`}>
      <FlaskConical size={12} aria-hidden /> Synthetic demo data
    </span>
  );
}

export function SyntheticBanner() {
  return (
    <div role="note" className="flex items-center justify-center gap-2 border-b border-line bg-tint px-4 py-1.5 text-center text-xs text-subtle">
      <FlaskConical size={13} className="text-brand-4" aria-hidden />
      Prototype for research &amp; learning. All patients, values and predictions are synthetic. Not for clinical use.
    </div>
  );
}

/* ---------- Form field ---------- */
export function Field({ label, id, error, hint, icon: Icon, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={`w-full rounded-lg border bg-white py-2.5 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand-3 ${Icon ? 'pl-9' : 'pl-3'} ${error ? 'border-risk' : 'border-line'}`}
          {...props}
        />
      </div>
      {error ? <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-risk">{error}</p>
        : hint ? <p id={`${id}-hint`} className="mt-1 text-xs text-subtle">{hint}</p> : null}
    </div>
  );
}

/* ---------- Toggle ---------- */
export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {description && <span className="block text-xs text-subtle">{description}</span>}
      </span>
      <button
        type="button" role="switch" aria-checked={checked} aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, value, onChange, dark = false, className = '' }) {
  return (
    <div role="tablist" className={`flex gap-1 overflow-x-auto scroll-thin ${className}`}>
      {tabs.map((t) => {
        const id = t.id ?? t;
        const active = id === value;
        return (
          <button
            key={id} role="tab" aria-selected={active} onClick={() => onChange(id)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active ? 'btn-brand' : 'bg-white text-subtle hover:bg-tint border border-line'
            }`}
          >
            {t.label ?? t}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
            className="card w-full max-w-md p-6 outline-none" onMouseDown={(e) => e.stopPropagation()}
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-subtle hover:bg-tint"><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Skeleton / states ---------- */
export function Skeleton({ className = '' }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}
export function ListSkeleton({ rows = 4 }) {
  return <div role="status" aria-label="Loading" className="space-y-3">{Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>;
}
export function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {text && <p className="mt-1 text-sm text-subtle">{text}</p>}
    </div>
  );
}
export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-700">{message}</p>
      {onRetry && <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

/* ---------- Page header ---------- */
export function PageHeader({ title, subtitle, actions, synthetic = true }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold text-navy sm:text-[28px]">{title}</h1>
          {synthetic && <SyntheticTag />}
        </div>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-subtle">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Disclaimer({ children }) {
  return (
    <p role="note" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
      {children}
    </p>
  );
}
