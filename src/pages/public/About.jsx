import { motion } from 'framer-motion';
import { Card } from '../../components/ui';

const built = [
  ['Implemented (frontend prototype)', ['Patient and clinician interfaces on synthetic data', 'Deterministic, versioned Twin state engine with replay', 'What-if sandbox that forks a copy of state', 'Prediction review and audit-event UI']],
  ['Planned (not yet built)', ['FastAPI backend and PostgreSQL schema with Row Level Security', 'One defined, honestly evaluated prediction task', 'Evidence retrieval with verified sources', 'Optional deep-learning and quantum-ML comparisons']],
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-navy">AEVITWIN — A Lifetime of Health, Connected.</h1>
        <p className="mt-5 text-lg text-subtle">AEVITWIN is a continuously updated, patient-specific computational representation that integrates longitudinal clinical records and dynamic physiological observations to support a defined risk prediction, evidence-grounded explanation and clinician-reviewed workflow.</p>
        <p className="mt-4 text-subtle">The long-term architecture may connect many organ-system modules. This prototype does not claim a validated whole-human Digital Twin; it states which modules exist and how they are evaluated.</p>
      </motion.div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {built.map(([t, items]) => (
          <Card key={t} className="p-6"><h2 className="font-semibold text-navy">{t}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-subtle">{items.map((i) => <li key={i}>{i}</li>)}</ul></Card>))}
      </div>
    </div>
  );
}
