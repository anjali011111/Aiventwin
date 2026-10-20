import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, HeartPulse, Dna, Clock, Pill, CalendarDays, Lightbulb, GitBranch, Bot, Settings,
  Users, BarChart3, BookOpen, Stethoscope, Bell, Search, LogOut, Menu, X, Activity,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { SyntheticBanner } from '../ui';
import { useAuth } from '../../app/AuthProvider';
import { PALETTE_EVENT } from './CommandPalette';

export const patientNav = [
  { to: '/patient/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/patient/records', label: 'Records', icon: FileText },
  { to: '/patient/vitals', label: 'Vitals', icon: HeartPulse },
  { to: '/patient/digital-twin', label: 'Digital Twin', icon: Dna },
  { to: '/patient/timeline', label: 'Timeline', icon: Clock },
  { to: '/patient/medications', label: 'Medications', icon: Pill },
  { to: '/patient/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/patient/insights', label: 'Health Insights', icon: Lightbulb },
  { to: '/patient/family-history', label: 'Family History', icon: GitBranch },
  { to: '/patient/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/patient/settings', label: 'Settings', icon: Settings },
];
export const doctorNav = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/patients', label: 'Patients', icon: Users },
  { to: '/doctor/digital-twin', label: 'Digital Twin', icon: Dna },
  { to: '/doctor/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/doctor/insights', label: 'Prediction Review', icon: Stethoscope },
  { to: '/doctor/evidence', label: 'Evidence', icon: BookOpen },
  { to: '/doctor/settings', label: 'Settings', icon: Settings },
];

function NavItems({ items, onNavigate, dark }) {
  return (
    <ul className="space-y-1">
      {items.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to} onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand text-ink'
                  : dark ? 'text-slate-300 hover:bg-white/10' : 'text-subtle hover:bg-tint'
              }`}
          >
            <Icon size={18} aria-hidden /> {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

/** role: 'patient' | 'doctor'. Doctor shell is dark-sidebar web dashboard; patient shell is light with mobile bottom bar. */
export default function AppShell({ role }) {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const items = role === 'doctor' ? doctorNav : patientNav;
  const dark = role === 'doctor';
  const out = () => { signOut(); nav('/'); };

  const sidebar = (
    <div className={`flex h-full flex-col p-4 ${dark ? 'bg-ink' : 'bg-white'}`}>
      <div className="mb-6 px-2"><Logo light={dark} to={`/${role}/dashboard`} tagline /></div>
      <nav aria-label={`${role} navigation`} className="flex-1 overflow-y-auto scroll-thin"><NavItems items={items} dark={dark} onNavigate={() => setOpen(false)} /></nav>
      <button onClick={out} className={`mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${dark ? 'text-slate-300 hover:bg-white/10' : 'text-subtle hover:bg-tint'}`}>
        <LogOut size={18} aria-hidden /> Sign out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
      <SyntheticBanner />
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-line lg:block">{sidebar}</aside>

        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button aria-label="Close menu" className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
              <motion.div className="relative h-full w-72 max-w-[85%]" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}>{sidebar}</motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
            <button className="rounded-lg p-2 text-navy hover:bg-tint lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            {role === 'doctor' ? (
              <div className="relative max-w-md flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
                <input aria-label="Search patients" placeholder="Search patient by name or ID" className="w-full rounded-lg border border-line bg-mist py-2 pl-9 pr-3 text-sm placeholder:text-muted" />
              </div>
            ) : (
              <div className="flex-1 text-sm text-subtle"><span className="hidden items-center gap-1.5 sm:inline-flex"><Activity size={14} className="text-brand-4" aria-hidden /> Twin synced with synthetic data</span></div>
            )}
            <button onClick={() => window.dispatchEvent(new Event(PALETTE_EVENT))} aria-label="Open command palette (Ctrl or Command + K)"
              className="hidden items-center gap-2 rounded-lg border border-line bg-mist px-3 py-2 text-xs text-subtle hover:bg-tint sm:flex">
              <Search size={14} aria-hidden /> Jump to… <kbd className="rounded border border-line bg-white px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
            </button>
            <button className="relative rounded-lg p-2 text-navy hover:bg-tint" aria-label="Notifications (demo)"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-3" /></button>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-tint text-sm font-semibold text-brand-4" aria-hidden>{user?.name?.split(' ').map((s) => s[0]).slice(-2).join('')}</span>
              <span className="hidden text-sm leading-tight sm:block"><span className="block font-semibold text-navy">{user?.name}</span><span className="block text-xs text-subtle">{role === 'doctor' ? 'General Physician' : 'Patient'} · demo session</span></span>
            </div>
          </header>
          <main id="main" className="mx-auto max-w-[1400px] px-4 pb-24 pt-6 sm:px-6 lg:pb-10"><Outlet /></main>
        </div>
      </div>

      {role === 'patient' && (
        <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-white px-2 py-1.5 lg:hidden">
          {[patientNav[0], patientNav[1], patientNav[3], patientNav[9], patientNav[10]].map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px] font-medium ${isActive ? 'text-brand-4' : 'text-subtle'}`}>
              <Icon size={20} aria-hidden />{label.replace('Digital Twin', 'Twin').replace('AI Assistant', 'Assistant')}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
