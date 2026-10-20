import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Move, FlaskConical } from 'lucide-react';
import BodyTwin from './BodyTwin';
import StatePanel from './StatePanel';
import { FreePanel } from './Movable';
import { Badge, Button, Card, Disclaimer } from '../ui';
import { useTwin } from '../../app/TwinProvider';
import { METRICS, statusOf } from '../../lib/twinEngine';
import { organs } from '../../data/mock';

const LS = 'aevitwin.canvas.v1';
const tone = { normal: 'ok', high: 'warn', low: 'warn', unknown: 'neutral' };

function liveMetrics(id, m) {
  const f = (k) => (m[k] ? `${m[k].value} ${m[k].unit}` : '—');
  const s = (k) => m[k]?.status ?? 'unknown';
  const map = {
    heart: [['Heart rate', f('heartRate'), s('heartRate')], ['Blood pressure', m.systolic && m.diastolic ? `${m.systolic.value}/${m.diastolic.value} mmHg` : '—', s('systolic')]],
    lungs: [['SpO₂', f('spo2'), s('spo2')]],
    brain: [['Sleep', f('sleep'), s('sleep')]],
    stomach: [['Glucose', f('glucose'), s('glucose')]],
  };
  return map[id] ?? organs[id].metrics;
}

/** Hypothetical-state fork. Never touches the real Twin; no causal claims. */
function WhatIf({ latest }) {
  const [code, setCode] = useState('glucose');
  const m = METRICS[code];
  const cur = latest.metrics[code]?.value ?? Math.round((m.normal[0] + m.normal[1]) / 2);
  const [val, setVal] = useState(cur);
  const fork = { ...latest.metrics, [code]: { ...latest.metrics[code], value: Number(val) } };
  const before = statusOf(code, cur);
  const after = statusOf(code, Number(val));
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2"><FlaskConical size={18} className="text-brand-4" aria-hidden /><h2 className="text-lg font-semibold text-navy">What-if sandbox</h2><Badge tone="info">Forked copy</Badge></div>
      <p className="mt-1 text-xs text-subtle">Hypothetical simulation — not a treatment recommendation. It re-classifies a copy of the state; it does not predict outcomes.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wi-code" className="mb-1 block text-xs font-medium text-navy">Hypothetical input</label>
          <select id="wi-code" value={code} onChange={(e) => { setCode(e.target.value); const c = latest.metrics[e.target.value]?.value ?? Math.round((METRICS[e.target.value].normal[0] + METRICS[e.target.value].normal[1]) / 2); setVal(c); }} className="w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm">
            {Object.entries(METRICS).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}
          </select>
          <label htmlFor="wi-val" className="mb-1 mt-3 block text-xs font-medium text-navy">Value: <span className="tabular-nums">{val} {m.unit}</span></label>
          <input id="wi-val" type="range" min={m.min} max={Math.min(m.max, m.normal[1] * 2)} step={m.max > 1000 ? 100 : m.max > 20 ? 1 : 0.1} value={val} onChange={(e) => setVal(e.target.value)} className="w-full accent-[#5170FD]" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-mist p-3"><p className="text-xs text-subtle">Current twin</p><p className="mt-1 font-semibold tabular-nums">{cur} {m.unit}</p><Badge tone={tone[before]} className="mt-1">{before}</Badge></div>
          <motion.div key={`${code}-${val}`} initial={{ scale: 0.97 }} animate={{ scale: 1 }} className="rounded-lg border border-brand-1 bg-tint p-3"><p className="text-xs text-subtle">Hypothetical fork</p><p className="mt-1 font-semibold tabular-nums">{Number(val)} {m.unit}</p><Badge tone={tone[after]} className="mt-1">{after}</Badge></motion.div>
          <p className="col-span-2 text-xs text-subtle">Forked copy holds {Object.keys(fork).length} metrics. Real Twin remains v{latest.version}.</p>
        </div>
      </div>
    </Card>
  );
}

export default function TwinWorkspace({ mode = 'patient' }) {
  const { latest } = useTwin();
  const [selected, setSelected] = useState('heart');
  const [resetKey, setResetKey] = useState(0);
  const canvasRef = useRef(null);
  const m = latest.metrics;
  const val = (k) => (m[k] ? `${m[k].value}` : '—');
  const unit = (k) => METRICS[k].unit;
  const num = (v, u) => <p className="text-2xl font-semibold tabular-nums text-navy">{v} <span className="text-xs font-normal text-subtle">{u}</span></p>;

  const panels = [
    { id: 'heart', title: 'Heart', pos: { left: '2%', top: '16%' }, body: <>{num(val('heartRate'), 'bpm')}<p className="text-xs text-subtle tabular-nums">BP {val('systolic')}/{val('diastolic')} mmHg</p></> },
    { id: 'lungs', title: 'Oxygen', pos: { right: '2%', top: '10%' }, body: num(val('spo2'), '%') },
    { id: 'glucose', title: 'Glucose', pos: { left: '2%', top: '50%' }, body: num(val('glucose'), unit('glucose')) },
    { id: 'sleep', title: 'Sleep', pos: { right: '2%', top: '40%' }, body: num(val('sleep'), 'hrs') },
    { id: 'steps', title: 'Activity', pos: { right: '2%', top: '70%' }, body: num(val('steps'), 'steps') },
  ];

  const org = organs[selected];
  const reset = () => { Object.keys(localStorage).filter((k) => k.startsWith(LS)).forEach((k) => localStorage.removeItem(k)); setResetKey((k) => k + 1); };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-8">
        <section aria-label="Digital twin body map">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><h2 className="text-lg font-semibold text-navy">{mode === 'doctor' ? 'Clinician workspace' : 'Your twin'}</h2><Badge tone="navy">v{latest.version}</Badge></div>
            <Button size="sm" variant="outline" onClick={reset}><RotateCcw size={14} aria-hidden /> Reset layout</Button>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle"><Move size={12} aria-hidden /> Drag the panels anywhere. Click an organ to inspect it.</p>

          <div ref={canvasRef} key={resetKey} className="relative mx-auto mt-2 h-[560px] w-full max-w-3xl">
            <BodyTwin selected={selected} onSelect={setSelected} className="absolute inset-y-0 left-1/2 h-full -translate-x-1/2" pulseKey={latest.version} />
            <div className="hidden md:block">
              {panels.map((p) => (
                <FreePanel key={p.id} id={p.id} storageKey={LS} constraintsRef={canvasRef} initial={p.pos} title={p.title}>{p.body}</FreePanel>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:hidden">
            {panels.map((p) => <div key={p.id} className="rounded-lg border border-line bg-white p-3"><p className="text-xs font-medium text-subtle">{p.title}</p>{p.body}</div>)}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={selected} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 border-t border-line pt-4" aria-live="polite">
              <div className="flex items-center justify-between"><h3 className="font-semibold text-navy">{org.name}</h3><span className="text-xs text-subtle">{org.system}</span></div>
              <ul className="mt-2 divide-y divide-line text-sm">
                {liveMetrics(selected, m).map(([k, v, s]) => (
                  <li key={k} className="flex items-center justify-between gap-3 py-2"><span className="text-subtle">{k}</span><span className="flex items-center gap-2 tabular-nums font-medium text-navy">{v}<Badge tone={tone[s] ?? 'ok'}>{s}</Badge></span></li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-subtle">{org.note}</p>
            </motion.div>
          </AnimatePresence>
        </section>
        <WhatIf latest={latest} />
      </div>

      <div className="space-y-5">
        <StatePanel />
        {mode === 'doctor' && <Disclaimer>Twin state shown to clinicians is derived from the observation log only. Predictions and summaries are decision support and require clinician review.</Disclaimer>}
      </div>
    </div>
  );
}
