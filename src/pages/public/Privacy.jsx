import { Card } from '../../components/ui';

const sections = [
  ['Synthetic data only', 'Every patient, value and prediction in this prototype is synthetic. Do not enter, upload or paste real patient records or identifiers.'],
  ['Decision support, not diagnosis', 'Outputs support qualified clinicians. AEVITWIN does not diagnose, prescribe or replace professional medical advice, and no model here is clinically validated.'],
  ['Access control', 'Choosing “clinician” at signup only requests access. Permissions are enforced on the server and in the database, never by the browser.'],
  ['Evidence and uncertainty', 'Explanations should cite retrieved source passages. When evidence is missing the assistant should say so instead of guessing. Predictions show uncertainty and the snapshot they were computed from.'],
  ['Voice and notes', 'Voice input shows a transcript preview and requires confirmation before anything is saved. Retention should be minimal.'],
  ['Auditability', 'Clinician review decisions are recorded as audit events: who acted, on what, and when.'],
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="eyebrow">Privacy &amp; responsible use</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-navy">How AEVITWIN should be used</h1>
      <p className="mt-4 text-subtle">This page describes the intended principles of the platform. It is not a legal privacy notice, which will be required before any real-world deployment.</p>
      <div className="mt-8 space-y-4">
        {sections.map(([t, d]) => <Card key={t} className="p-5"><h2 className="font-semibold text-navy">{t}</h2><p className="mt-1 text-sm text-subtle">{d}</p></Card>)}
      </div>
    </div>
  );
}
