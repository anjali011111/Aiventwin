import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Info } from 'lucide-react';
import AuthFrame from './AuthFrame';
import { Button, Field } from '../../components/ui';
import { useAuth } from '../../app/AuthProvider';

const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

export default function Login() {
  const { signInDemo } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState({});
  const [state, setState] = useState('idle'); // idle | loading | success
  const [notice, setNotice] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!emailOk(f.email)) next.email = 'Enter a valid email address.';
    if (f.password.length < 8) next.password = 'Password must be at least 8 characters.';
    setErr(next);
    if (Object.keys(next).length) return;
    setState('loading');
    // DEMO: no authentication happens. Supabase Auth replaces this later.
    setTimeout(() => { setState('success'); setTimeout(() => { signInDemo('patient'); nav(loc.state?.from ?? '/patient/dashboard'); }, 700); }, 900);
  };

  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to your AEVITWIN workspace.">
      <div role="note" className="mb-5 flex gap-2 rounded-xl border border-brand-1 bg-tint p-3 text-xs text-navy">
        <Info size={15} className="mt-0.5 shrink-0" aria-hidden />Demo mode: any valid-looking email and 8+ character password signs you in as the synthetic patient. No credentials are checked or stored.
      </div>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="email" label="Email" type="email" icon={Mail} autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={err.email} placeholder="you@example.com" />
        <Field id="password" label="Password" type="password" icon={Lock} autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} error={err.password} />
        <div className="flex justify-end"><Link to="/forgot-password" className="text-sm font-medium text-bluex hover:underline">Forgot password?</Link></div>
        <Button type="submit" className="w-full" size="lg" disabled={state !== 'idle'}>
          {state === 'loading' && <Loader2 size={18} className="animate-spin" aria-hidden />}
          {state === 'idle' ? 'Sign in' : state === 'loading' ? 'Signing in…' : 'Signed in ✓'}
        </Button>
        <p role="status" className="sr-only">{state === 'loading' ? 'Signing in' : state === 'success' ? 'Signed in' : ''}</p>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => setNotice('Google sign-in will be enabled when Supabase Auth is connected.')}>Google</Button>
        <Button variant="outline" onClick={() => setNotice('GitHub sign-in will be enabled when Supabase Auth is connected.')}>GitHub</Button>
      </div>
      <p role="status" className="mt-3 min-h-5 text-xs text-subtle">{notice}</p>

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs font-semibold text-subtle">Skip the form (demo)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" variant="cyan" onClick={() => { signInDemo('patient'); nav('/patient/dashboard'); }}>Patient demo</Button>
          <Button size="sm" variant="primary" onClick={() => { signInDemo('doctor'); nav('/doctor/dashboard'); }}>Clinician demo</Button>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-subtle">New here? <Link to="/signup" className="font-semibold text-bluex hover:underline">Create an account</Link></p>
    </AuthFrame>
  );
}
