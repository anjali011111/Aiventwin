import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft, Home, Info, ShieldCheck, LogOut, UserRound, Stethoscope } from 'lucide-react';
import { useAuth } from '../../app/AuthProvider';
import { patientNav, doctorNav } from './AppShell';

export const PALETTE_EVENT = 'aevitwin:palette';

/** Ctrl/⌘ + K "jump anywhere" palette. Keyboard-first: ↑ ↓ to move, Enter to go, Esc to close. */
export default function CommandPalette() {
  const { user, signInDemo, signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const input = useRef(null);

  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    const evt = () => setOpen(true);
    window.addEventListener('keydown', key);
    window.addEventListener(PALETTE_EVENT, evt);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener(PALETTE_EVENT, evt); };
  }, []);

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);

  const items = useMemo(() => {
    const go = (to) => () => nav(to);
    const base = (user?.role === 'doctor' ? doctorNav : user?.role === 'patient' ? patientNav : [])
      .map((n) => ({ id: n.to, label: n.label, hint: user.role === 'doctor' ? 'Clinician' : 'Patient', icon: n.icon, run: go(n.to) }));
    const pub = [
      { id: '/', label: 'Home page', hint: 'Public', icon: Home, run: go('/') },
      { id: '/about', label: 'About AEVITWIN', hint: 'Public', icon: Info, run: go('/about') },
      { id: '/privacy', label: 'Privacy & responsible use', hint: 'Public', icon: ShieldCheck, run: go('/privacy') },
    ];
    const acts = [
      user?.role !== 'patient' && { id: 'a-p', label: 'Open patient demo', hint: 'Switch', icon: UserRound, run: () => { signInDemo('patient'); nav('/patient/dashboard'); } },
      user?.role !== 'doctor' && { id: 'a-d', label: 'Open clinician demo', hint: 'Switch', icon: Stethoscope, run: () => { signInDemo('doctor'); nav('/doctor/dashboard'); } },
      user && { id: 'a-o', label: 'Sign out', hint: 'Session', icon: LogOut, run: () => { signOut(); nav('/'); } },
    ].filter(Boolean);
    return [...base, ...acts, ...pub];
  }, [user, nav, signInDemo, signOut]);

  const shown = items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q.trim().toLowerCase()));
  const pick = (i) => { setOpen(false); i?.run(); };
  const onKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(shown.length - 1, i + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); pick(shown[idx]); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close command palette" className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}
            initial={{ y: -14, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, scale: 0.98 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={18} className="text-muted" aria-hidden />
              <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }} placeholder="Jump to a page or action…" aria-label="Search pages and actions"
                role="combobox" aria-expanded="true" aria-controls="cmd-list" className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted" />
              <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-subtle">Esc</kbd>
            </div>
            <ul id="cmd-list" role="listbox" className="max-h-80 overflow-y-auto p-2 scroll-thin">
              {shown.length === 0 && <li className="px-3 py-6 text-center text-sm text-subtle">No match.</li>}
              {shown.map((i, n) => (
                <li key={i.id} role="option" aria-selected={n === idx}>
                  <button onMouseEnter={() => setIdx(n)} onClick={() => pick(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${n === idx ? 'bg-navy text-white' : 'text-navy'}`}>
                    <i.icon size={17} aria-hidden className={n === idx ? 'text-cyanx' : 'text-bluex'} />
                    <span className="flex-1 font-medium">{i.label}</span>
                    <span className={`text-xs ${n === idx ? 'text-slate-300' : 'text-subtle'}`}>{i.hint}</span>
                    {n === idx && <CornerDownLeft size={14} aria-hidden className="text-slate-300" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
