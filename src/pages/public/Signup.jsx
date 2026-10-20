import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ShieldCheck } from 'lucide-react';
import AuthFrame from './AuthFrame';
import { Button, Field } from '../../components/ui';

export default function Signup() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', consent: false, clinician: false });
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const n = {};
    if (f.name.trim().length < 2) n.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) n.email = 'Enter a valid email address.';
    if (f.password.length < 8) n.password = 'Use at least 8 characters.';
    if (f.confirm !== f.password) n.confirm = 'Passwords do not match.';
    if (!f.consent) n.consent = 'Consent is required to create an account.';
    setErr(n);
    if (Object.keys(n).length) return;
    setLoading(true);
    setTimeout(() => nav('/verify-email', { state: { email: f.email } }), 900);
  };

  return (
    <AuthFrame title="Create your account" subtitle="Start with a patient account. Clinician access is granted separately.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="name" label="Full name" icon={User} autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={err.name} />
        <Field id="email" label="Email" type="email" icon={Mail} autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={err.email} />
        <Field id="password" label="Password" type="password" icon={Lock} autoComplete="new-password" hint="At least 8 characters." value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} error={err.password} />
        <Field id="confirm" label="Confirm password" type="password" icon={Lock} autoComplete="new-password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} error={err.confirm} />

        <fieldset className="rounded-xl border border-line p-3">
          <legend className="px-1 text-xs font-semibold text-subtle">Access</legend>
          <label className="flex items-start gap-2 text-sm text-navy">
            <input type="checkbox" className="mt-1 accent-[#14213D]" checked={f.clinician} onChange={(e) => setF({ ...f, clinician: e.target.checked })} />
            <span>I am a clinician and want to <strong>request</strong> clinician access.
              <span className="mt-1 flex gap-1.5 text-xs text-subtle"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-ok" aria-hidden />This does not grant any permissions. An administrator must approve it, and access is enforced on the server.</span></span>
          </label>
        </fieldset>

        <div>
          <label className="flex items-start gap-2 text-sm text-navy">
            <input type="checkbox" className="mt-1 accent-[#14213D]" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} aria-invalid={!!err.consent} />
            <span>I understand this is a research prototype using synthetic data, and I agree to the <Link to="/privacy" className="font-medium text-bluex underline">responsible-use policy</Link>.</span>
          </label>
          {err.consent && <p role="alert" className="mt-1 text-xs text-risk">{err.consent}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <Loader2 size={18} className="animate-spin" aria-hidden />}{loading ? 'Creating account…' : 'Create account'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-subtle">Already registered? <Link to="/login" className="font-semibold text-bluex hover:underline">Sign in</Link></p>
    </AuthFrame>
  );
}
