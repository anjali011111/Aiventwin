import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MailCheck, BadgeCheck } from 'lucide-react';
import AuthFrame from './AuthFrame';
import { Button } from '../../components/ui';

export default function VerifyEmail() {
  const { state } = useLocation();
  const [status, setStatus] = useState('pending'); // pending | verified
  const [resent, setResent] = useState(false);
  const email = state?.email ?? 'your email address';

  return (
    <AuthFrame title={status === 'verified' ? 'Email verified' : 'Check your inbox'} subtitle={status === 'verified' ? 'Your account is ready.' : `We sent a verification link to ${email}.`}>
      <div className="py-6 text-center" role="status">
        {status === 'verified' ? <BadgeCheck size={40} className="mx-auto text-ok" aria-hidden /> : <MailCheck size={40} className="mx-auto text-bluex" aria-hidden />}
        <p className="mt-3 text-sm text-subtle">{status === 'verified' ? 'You can now sign in.' : 'Open the link in the email to finish setting up. It may take a minute to arrive.'}</p>
      </div>
      {status === 'verified' ? (
        <Button to="/login" size="lg" className="mt-5 w-full">Continue to sign in</Button>
      ) : (
        <div className="mt-5 space-y-3">
          <Button variant="outline" className="w-full" onClick={() => setResent(true)}>{resent ? 'Link re-sent (demo)' : 'Resend email'}</Button>
          <Button variant="ghost" className="w-full" onClick={() => setStatus('verified')}>Demo: simulate clicking the link</Button>
        </div>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/" className="font-semibold text-bluex hover:underline">Back to home</Link></p>
    </AuthFrame>
  );
}
