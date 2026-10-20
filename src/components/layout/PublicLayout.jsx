import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { Button, SyntheticBanner } from '../ui';
import { useAuth } from '../../app/AuthProvider';

const links = [{ to: '/about', label: 'About' }, { to: '/privacy', label: 'Responsible use' }];

export function PublicNav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const txt = 'text-subtle hover:text-navy';
  return (
    <header className="relative z-30 border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo tagline />
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {links.map((l) => <NavLink key={l.to} to={l.to} className={`text-sm font-medium ${txt}`}>{l.label}</NavLink>)}
          <a href="/#how" className={`text-sm font-medium ${txt}`}>How it works</a>
          {user ? <Button size="sm" to={`/${user.role}/dashboard`}>Open app</Button> : (<>
            <Link to="/login" className={`text-sm font-medium ${txt}`}>Log in</Link>
            <Button size="sm" to="/signup">Get started</Button></>)}
        </nav>
        <button className="rounded-lg p-2 text-navy md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="mx-5 mb-3 space-y-1 rounded-lg border border-line bg-white p-3 md:hidden">
          {[...links, { to: '/login', label: 'Log in' }, { to: '/signup', label: 'Get started' }].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy hover:bg-tint">{l.label}</Link>))}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-white text-subtle">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><Logo tagline /><p className="mt-4 max-w-sm text-sm">A research prototype exploring a patient-specific healthcare Digital Twin. It supports clinicians; it does not replace them.</p></div>
        <div className="text-sm"><p className="mb-2 font-semibold text-navy">Platform</p><ul className="space-y-1.5"><li><Link to="/about" className="hover:text-navy">About</Link></li><li><Link to="/privacy" className="hover:text-navy">Privacy &amp; responsible use</Link></li><li><Link to="/login" className="hover:text-navy">Log in</Link></li></ul></div>
        <div className="text-sm"><p className="mb-2 font-semibold text-navy">Status</p><p>Frontend prototype · synthetic data only · no clinical validation.</p></div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs">© 2026 AEVITWIN · Prototype / research use, not clinical deployment</div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SyntheticBanner />
      <PublicNav />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
