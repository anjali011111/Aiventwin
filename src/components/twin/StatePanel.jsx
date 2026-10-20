import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { History, Play, Pause, Plus, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { Badge, Button, Card } from '../ui';
import { useTwin } from '../../app/TwinProvider';
import { METRICS, freshness } from '../../lib/twinEngine';

const tone = { normal: 'ok', high: 'warn', low: 'warn', unknown: 'neutral' };

/**
 * Observation → Twin state demo + snapshot replay.
 * Every submit goes through the deterministic engine (src/lib/twinEngine.js).
 */
export default function StatePanel({ compact = false }) {
  const { snapshots, log, submit, logEvent } = useTwin();
  const [view, setView] = useState(null);            // null = live (latest)
  const [playing, setPlaying] = useState(false);
  const [code, setCode] = useState('heartRate');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);

  const idx = view ?? snapshots.length - 1;
  const snap = snapshots[idx];
  const prev = snapshots[idx - 1];

  // Replay: step through snapshots, then return to live
  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => {
      setView((v) => {
        const cur = v ?? 0;
        if (cur >= snapshots.length - 1) { setPlaying(false); return null; }
        return cur + 1;
      });
    }, 850);
    return () => clearInterval(t);
  }, [playing, snapshots.length]);

  const startReplay = () => { if (playing) { setPlaying(false); return; } setView(0); setPlaying(true); };

  const send = (c, v) => {
    const r = submit({ code: c, value: v, unit: METRICS[c].unit });
    setResult(r);
    if (r.status === 'applied') { setView(null); logEvent({ action: 'observation.ingested', detail: `${METRICS[c].label} = ${v} ${METRICS[c].unit}` }); }
  };
  const simulate = () => {
    const codes = ['heartRate', 'glucose', 'spo2', 'systolic'];
    const c = codes[Math.floor(Math.random() * codes.length)];
    const m = METRICS[c];
    const base = snapshots[snapshots.length - 1].metrics[c]?.value ?? (m.normal[0] + m.normal[1]) / 2;
    const v = Math.round(Math.min(m.max, Math.max(m.min, base + (Math.random() * 16 - 6))));
    setCode(c); setValue(String(v)); send(c, v);
  };

  const changed = useMemo(() => {
    const set = new Set();
    if (!prev) return set;
    Object.keys(snap.metrics).forEach((k) => { if (snap.metrics[k]?.ts !== prev.metrics[k]?.ts) set.add(k); });
    return set;
  }, [snap, prev]);

  const rows = Object.keys(METRICS).filter((k) => snap.metrics[k] || !compact);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-navy">Twin state engine</h2>
          <Badge tone="navy">v{snap.version}</Badge>
          {view !== null && <Badge tone="warn">Replaying snapshot {idx + 1}/{snapshots.length}</Badge>}
        </div>
        <Button size="sm" variant="outline" onClick={startReplay} aria-pressed={playing}>
          {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}{playing ? 'Pause' : 'Replay history'}
        </Button>
      </div>
      <p className="mt-1 text-xs text-subtle">
        Generated {snap.generatedAt.slice(0, 16).replace('T', ' ')} UTC · latest observation {freshness(snap.latestObservationAt)} ·{' '}
        {snap.missing.length ? `missing: ${snap.missing.join(', ')}` : 'no missing fields'}
      </p>

      {/* Replay scrubber */}
      <div className="mt-4">
        <label htmlFor="replay" className="mb-1 flex items-center gap-1.5 text-xs font-medium text-navy"><History size={13} aria-hidden /> Snapshot history</label>
        <input id="replay" type="range" min={0} max={snapshots.length - 1} value={idx}
          onChange={(e) => { setPlaying(false); const n = Number(e.target.value); setView(n === snapshots.length - 1 ? null : n); }}
          className="w-full accent-[#5170FD]" aria-valuetext={`Version ${snap.version}: ${snap.note}`} />
        <p className="mt-1 text-xs text-subtle" aria-live="polite">v{snap.version} — {snap.note}</p>
      </div>

      {/* State table */}
      <div className="mt-3 overflow-x-auto scroll-thin">
        <table className="w-full min-w-[420px] text-sm">
          <caption className="sr-only">Digital Twin metrics for the selected snapshot</caption>
          <thead><tr className="text-left text-xs text-subtle"><th className="py-1.5 pr-2 font-semibold">Metric</th><th className="font-semibold">Value</th><th className="font-semibold">Status</th><th className="font-semibold">Source · time</th></tr></thead>
          <tbody>
            {rows.map((k) => {
              const m = snap.metrics[k];
              return (
                <tr key={`${k}-${snap.version}`} className={`border-t border-line ${changed.has(k) ? 'flash' : ''}`}>
                  <td className="py-2 pr-2 font-medium text-navy">{METRICS[k].label}</td>
                  <td className="tabular-nums">{m ? <>{m.value} <span className="text-xs text-subtle">{m.unit}</span> {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : ''}</> : <span className="text-subtle">—</span>}</td>
                  <td>{m ? <Badge tone={tone[m.status]}>{m.status}</Badge> : <Badge>missing</Badge>}</td>
                  <td className="text-xs text-subtle">{m ? `${m.source} · ${freshness(m.ts)}` : 'no observation'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add observation */}
      <form className="mt-4 flex flex-wrap items-end gap-2 rounded-lg bg-mist p-3" onSubmit={(e) => { e.preventDefault(); if (value !== '') send(code, Number(value)); }}>
        <div>
          <label htmlFor="obs-code" className="mb-1 block text-xs font-medium text-navy">Metric</label>
          <select id="obs-code" value={code} onChange={(e) => setCode(e.target.value)} className="rounded-lg border border-line bg-white px-2.5 py-2 text-sm">
            {Object.entries(METRICS).map(([k, m]) => <option key={k} value={k}>{m.label} ({m.unit})</option>)}
          </select>
        </div>
        <div className="w-28">
          <label htmlFor="obs-val" className="mb-1 block text-xs font-medium text-navy">Value</label>
          <input id="obs-val" type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm" placeholder={`${METRICS[code].unit}`} />
        </div>
        <Button size="sm" variant="cyan" type="submit"><Plus size={15} aria-hidden /> Add observation</Button>
        <Button size="sm" variant="outline" type="button" onClick={simulate}><Sparkles size={15} aria-hidden /> Simulate wearable reading</Button>
      </form>

      <div aria-live="polite" className="mt-3 min-h-[3rem]">
        {result && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border px-3 py-2 text-sm ${result.status === 'applied' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : result.status === 'rejected' ? 'border-red-200 bg-red-50 text-red-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            <strong className="capitalize">{result.status}:</strong> {result.message}
            {result.diff.map((d) => (
              <div key={d.field} className="mt-1 flex items-center gap-2 text-xs"><span>{d.field}</span><span className="tabular-nums">{d.before ?? '—'}</span><ArrowRight size={12} aria-hidden /><strong className="tabular-nums">{d.after} {d.unit}</strong></div>
            ))}
          </motion.div>
        )}
      </div>

      {!compact && (
        <details className="mt-2 text-sm">
          <summary className="flex cursor-pointer items-center gap-1.5 font-medium text-navy"><Lock size={14} aria-hidden /> Immutable observation log ({log.length})</summary>
          <ul className="mt-2 max-h-40 space-y-1 overflow-auto scroll-thin text-xs text-subtle">
            {log.slice(0, 12).map((o) => <li key={o.id} className="tabular-nums">{o.ts.slice(0, 16).replace('T', ' ')} · {METRICS[o.code].label} {o.value} {o.unit} · {o.source}</li>)}
          </ul>
        </details>
      )}
    </Card>
  );
}
