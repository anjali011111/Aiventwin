import { useState } from 'react';
import { PageHeader, Card, Toggle, Button, Field } from '../ui';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../app/AuthProvider';

/** Shared settings screen for both roles. Preferences persist locally only (demo). */
export default function SettingsPanel({ role }) {
  const { user } = useAuth();
  const [prefs, setPrefs] = useLocalStorage(`aevitwin.prefs.${role}`, role === 'doctor'
    ? { aiSummaries: true, evidenceFirst: true, emailAlerts: false }
    : { shareWithClinician: true, wearable: true, voiceRetention: false, reminders: true });
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);
  const set = (k) => (v) => { setPrefs({ ...prefs, [k]: v }); setSaved(false); };

  const toggles = role === 'doctor' ? [
    ['aiSummaries', 'Show AI consultation summaries', 'Summaries are always labelled as decision support and need your review.'],
    ['evidenceFirst', 'Show evidence drawer by default', 'Display retrieved passages beside each prediction.'],
    ['emailAlerts', 'Email me about stale Twin data', 'Notify when a patient has had no observations for several days.'],
  ] : [
    ['shareWithClinician', 'Share my records with my care team', 'Only clinicians with approved access can view them.'],
    ['wearable', 'Include wearable observations in my Twin', 'Simulated in this demo.'],
    ['voiceRetention', 'Keep voice recordings', 'Off by default. Transcripts need your confirmation before saving.'],
    ['reminders', 'Appointment reminders', ''],
  ];

  return (
    <>
      <PageHeader title="Settings" subtitle="Profile, privacy and preferences." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6"><h2 className="font-semibold text-navy">Profile</h2>
          <div className="mt-4 space-y-4"><Field id="s-name" label="Display name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
            <Field id="s-role" label="Role" value={role === 'doctor' ? 'Clinician (approved by administrator in production)' : 'Patient'} readOnly hint="Roles come from the server and cannot be changed here." />
            <Button variant="primary" onClick={() => setSaved(true)}>Save changes</Button>
            <p role="status" className="min-h-5 text-xs text-ok">{saved ? 'Saved locally (demo).' : ''}</p></div></Card>
        <Card className="p-6"><h2 className="font-semibold text-navy">{role === 'doctor' ? 'Clinical preferences' : 'Privacy & preferences'}</h2>
          <div className="mt-2 divide-y divide-line">{toggles.map(([k, l, d]) => <Toggle key={k} label={l} description={d} checked={!!prefs[k]} onChange={set(k)} />)}</div></Card>
        <Card className="p-6 lg:col-span-2"><h2 className="font-semibold text-navy">Accessibility</h2>
          <p className="mt-2 text-sm text-subtle">AEVITWIN follows your system’s “reduce motion” setting automatically. Every draggable panel can also be moved with the keyboard: focus its grip and use the arrow keys.</p></Card>
      </div>
    </>
  );
}
