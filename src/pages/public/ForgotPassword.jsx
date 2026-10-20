import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import AuthFrame from './AuthFrame';
import { Button, Field } from '../../components/ui';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [state, setState] = useState('idle');

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.');
    setErr(''); setState('loading');
    setTimeout(() => setState('sent'), 800);
  };

  return (
    <AuthFrame title="Reset your password" subtitle="We will email you a link to choose a new password.">
      {state === 'sent' ? (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          <CheckCircle2 className="mb-2 text-ok" aria-hidden />
          If an account exists for <strong>{email}</strong>, a reset link is on its way. (Demo: no email is actually sent.)
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field id="email" label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
          <Button type="submit" size="lg" className="w-full" disabled={state === 'loading'}>{state === 'loading' && <Loader2 size={18} className="animate-spin" aria-hidden />}Send reset link</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-bluex hover:underline">← Back to sign in</Link></p>
    </AuthFrame>
  );
}
