import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Watch, Dna, Lightbulb, Stethoscope, Mic, BookOpen, GitBranch, FlaskConical, ShieldCheck, Move, Layers } from 'lucide-react';
import { PublicNav, Footer } from '../../components/layout/PublicLayout';
import BodyTwin from '../../components/twin/BodyTwin';
import StatePanel from '../../components/twin/StatePanel';
import { FreePanel } from '../../components/twin/Movable';
import { Button, SyntheticBanner } from '../../components/ui';
import { useTwin } from '../../app/TwinProvider';
import { useAuth } from '../../app/AuthProvider';

const fade = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } };

const steps = [
  { icon: FileText, t: 'Records', d: 'Longitudinal labs, diagnoses, medications and encounters.' },
  { icon: Watch, t: 'Observations', d: 'Wearable and simulated physiological readings with provenance.' },
  { icon: Dna, t: 'Twin state', d: 'A versioned, replayable snapshot — computed deterministically.' },
  { icon: Lightbulb, t: 'Insights', d: 'One defined prediction, with uncertainty and the inputs behind it.' },
  { icon: Stethoscope, t: 'Clinician review', d: 'Evidence-cited summaries, human sign-off, full audit trail.' },
];

const modules = [
  { icon: Dna, t: 'Digital Twin engine', d: 'Versioned snapshots, immutable observation history, state replay.' },
  { icon: Lightbulb, t: 'Predictive analytics', d: 'Classical ML baseline first; deep learning and QML only as honest experiments.' },
  { icon: BookOpen, t: 'Evidence-grounded RAG', d: 'Passage-level citations and abstention when evidence is missing.' },
  { icon: GitBranch, t: 'Family & genetic insight', d: 'Family-tree visualisation of inherited-risk context.' },
  { icon: Mic, t: 'Voice & multilingual', d: 'Speak, preview the transcript, confirm before anything is saved.' },
  { icon: Layers, t: 'What-if sandbox', d: 'Fork a copy of the state. Hypothetical only — never a recommendation.' },
];

export default function Landing() {
  const { latest } = useTwin();
  const { signInDemo } = useAuth();
  const nav = useNavigate();
  const enter = (role) => { signInDemo(role); nav(`/${role}/dashboard`); };

  return (
    <div className="bg-white">
      <SyntheticBanner />
      <PublicNav />

      {/* HERO — headline left, anatomy figure right, nothing else */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow">AI-driven personal healthcare digital twin</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-navy sm:text-5xl">
            Your Health. Understood as a <span className="text-brand-4">Living Digital Twin.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-subtle">
            Connect longitudinal health records, physiological observations, and AI-powered insights into one continuously updated,
            patient-specific view — grounded in evidence and reviewed by clinicians.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => enter('patient')}>Explore patient demo <ArrowRight size={18} aria-hidden /></Button>
            <Button size="lg" variant="outline" onClick={() => enter('doctor')}>Explore clinician demo</Button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-subtle"><FlaskConical size={14} className="text-brand-4" aria-hidden /> Demo mode uses synthetic data and no real sign-in.</p>
        </motion.div>

        <HeroFigure m={latest.metrics} version={latest.version} />
      </section>

      {/* HOW IT WORKS — one continuous row, thin dividers */}
      <section id="how" className="mx-auto max-w-7xl border-t border-line px-5 py-16">
        <motion.div {...fade} className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-bold text-navy">From scattered data to a state you can replay.</h2>
        </motion.div>
        <ol className="mt-8 grid divide-y divide-line border-y border-line md:grid-cols-5 md:divide-x md:divide-y-0">
          {steps.map((s, i) => (
            <motion.li key={s.t} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }} className="p-5">
              <s.icon size={20} className="text-brand-4" aria-hidden />
              <p className="mt-3 text-xs text-subtle">Step {i + 1}</p>
              <h3 className="font-semibold text-navy">{s.t}</h3>
              <p className="mt-1 text-sm text-subtle">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* LIVE DEMO */}
      <section className="border-t border-line bg-mist py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-start gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <motion.div {...fade}>
            <p className="eyebrow">Try it</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Send an observation. Watch the Twin advance a version.</h2>
            <p className="mt-4 text-subtle">This is a real, deterministic state engine running in your browser on synthetic data. Try an out-of-range value, a wrong unit or a duplicate and see how it is handled. Then scrub the history slider to replay earlier snapshots.</p>
            <ul className="mt-5 space-y-2 text-sm text-navy">
              {['Raw observations are never edited — only appended.', 'Every change creates a new version with source and timestamp.', 'No language model is used to compute state.'].map((t) => (
                <li key={t} className="flex gap-2"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-ok" aria-hidden />{t}</li>))}
            </ul>
          </motion.div>
          <motion.div {...fade}><StatePanel compact /></motion.div>
        </div>
      </section>

      {/* MODULES — plain list with hairlines */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <motion.div {...fade} className="max-w-2xl"><p className="eyebrow">Platform</p><h2 className="mt-2 text-3xl font-bold text-navy">Modular by design. Honest about what is built.</h2></motion.div>
        <div className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((x, i) => (
            <motion.div key={x.t} {...fade} transition={{ duration: 0.4, delay: (i % 3) * 0.05 }} className="border-t border-line py-6">
              <x.icon size={20} className="text-brand-4" aria-hidden /><h3 className="mt-3 font-semibold text-navy">{x.t}</h3><p className="mt-1 text-sm text-subtle">{x.d}</p>
            </motion.div>))}
        </div>
      </section>

      {/* TWO EXPERIENCES */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2 md:divide-x md:divide-line">
          {[
            { role: 'patient', t: 'For patients', d: 'Your records, vitals, family history and a voice assistant in one calm mobile-first app.', c: 'Open patient demo', primary: true },
            { role: 'doctor', t: 'For clinicians', d: 'Authorised patient list, Twin workspace, prediction review with evidence and an audit trail.', c: 'Open clinician demo' },
          ].map((x) => (
            <div key={x.role} className="px-5 py-12 md:px-10">
              <h3 className="text-2xl font-bold text-navy">{x.t}</h3><p className="mt-2 max-w-md text-subtle">{x.d}</p>
              <Button className="mt-6" variant={x.primary ? 'primary' : 'outline'} onClick={() => enter(x.role)}>{x.c} <ArrowRight size={16} aria-hidden /></Button>
            </div>))}
        </div>
      </section>

      {/* RESPONSIBLE USE */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="text-3xl font-bold text-navy">Decision support, not a diagnosis.</h2>
          <p className="mt-4 text-subtle">AEVITWIN is a research prototype. Predictions are decision support for qualified clinicians. It does not diagnose, prescribe or replace professional care, and no module has been clinically validated.</p>
          <div className="mt-6 flex justify-center gap-3"><Button variant="outline" to="/privacy">Read responsible-use policy</Button><Button variant="outline" to="/about">About the project</Button></div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/** The anatomy figure is the focal point. Three slim data callouts can be flung around it (drag the grip). */
function HeroFigure({ m, version }) {
  const ref = useRef(null);
  const val = (k, u) => <p className="text-xl font-semibold tabular-nums text-navy">{m[k]?.value ?? '—'} <span className="text-xs font-normal text-subtle">{u}</span></p>;
  return (
    <div ref={ref} className="relative mx-auto h-[540px] w-full max-w-md">
      <BodyTwin selected={null} className="absolute inset-y-0 left-1/2 h-full -translate-x-1/2" pulseKey={version} />
      <div className="hidden md:block">
        <FreePanel fling id="h-hr" storageKey="aevitwin.hero.v3" constraintsRef={ref} initial={{ left: '-4%', top: '22%' }} title="Heart rate">{val('heartRate', 'bpm')}</FreePanel>
        <FreePanel fling id="h-gl" storageKey="aevitwin.hero.v3" constraintsRef={ref} initial={{ right: '-4%', top: '38%' }} title="Glucose">{val('glucose', 'mg/dL')}</FreePanel>
        <FreePanel fling id="h-v" storageKey="aevitwin.hero.v3" constraintsRef={ref} initial={{ left: '-2%', top: '64%' }} title="Twin version">
          <p className="text-xl font-semibold tabular-nums text-navy">v{version}</p><p className="flex items-center gap-1 text-[11px] text-subtle"><Move size={11} aria-hidden /> drag me</p>
        </FreePanel>
      </div>
    </div>
  );
}
