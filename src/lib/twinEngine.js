/**
 * Deterministic, versioned Digital Twin state engine (frontend simulation).
 *
 * Mirrors the blueprint rules that the backend must later implement:
 *  - raw observations are immutable (we only ever append to a log)
 *  - every state change produces a NEW snapshot with version + provenance
 *  - duplicates, invalid units, future timestamps and late data are handled explicitly
 *  - NO language model is involved in computing state
 */

export const METRICS = {
  heartRate:  { label: 'Heart rate',     unit: 'bpm',   min: 30,  max: 220, normal: [50, 100] },
  systolic:   { label: 'Systolic BP',    unit: 'mmHg',  min: 60,  max: 260, normal: [90, 130] },
  diastolic:  { label: 'Diastolic BP',   unit: 'mmHg',  min: 30,  max: 160, normal: [60, 85] },
  glucose:    { label: 'Blood glucose',  unit: 'mg/dL', min: 30,  max: 600, normal: [70, 140] },
  spo2:       { label: 'SpO₂',           unit: '%',     min: 70,  max: 100, normal: [95, 100] },
  sleep:      { label: 'Sleep',          unit: 'hrs',   min: 0,   max: 16,  normal: [6.5, 9] },
  steps:      { label: 'Activity',       unit: 'steps', min: 0,   max: 80000, normal: [4000, 20000] },
};

export function statusOf(code, value) {
  const m = METRICS[code];
  if (!m || value == null) return 'unknown';
  if (value < m.normal[0]) return 'low';
  if (value > m.normal[1]) return 'high';
  return 'normal';
}

let counter = 0;
export function makeObservation({ code, value, unit, ts, source = 'Synthetic wearable' }) {
  counter += 1;
  return { id: `obs-${Date.now()}-${counter}`, patientId: 'P-001', code, value: Number(value), unit, ts: ts ?? new Date().toISOString(), source };
}

export function validateObservation(obs, now = Date.now()) {
  const m = METRICS[obs.code];
  if (!m) return 'Unknown metric code.';
  if (obs.unit !== m.unit) return `Invalid unit "${obs.unit}" — expected ${m.unit}.`;
  if (!Number.isFinite(obs.value)) return 'Value must be a number.';
  if (obs.value < m.min || obs.value > m.max) return `Value out of plausible range (${m.min}–${m.max} ${m.unit}).`;
  const t = Date.parse(obs.ts);
  if (Number.isNaN(t)) return 'Invalid timestamp.';
  if (t > now + 60_000) return 'Timestamp is in the future.';
  return null;
}

export const REQUIRED_FIELDS = ['heartRate', 'systolic', 'diastolic', 'glucose', 'spo2', 'sleep', 'steps', 'hba1c'];

export function emptySnapshot() {
  return { version: 9, generatedAt: '2026-10-15T06:00:00.000Z', latestObservationAt: null, metrics: {}, missing: [...REQUIRED_FIELDS], note: 'Baseline' };
}

/**
 * Apply one observation. Returns { snapshot, status, message, diff }.
 * status: 'applied' | 'late' | 'duplicate' | 'rejected'
 * A "late" observation is stored in the log but does not overwrite a newer value.
 */
export function applyObservation(snapshot, obs, log = []) {
  const err = validateObservation(obs);
  if (err) return { snapshot, status: 'rejected', message: err, diff: [] };

  const dup = log.some((o) => o.code === obs.code && o.ts === obs.ts && o.value === obs.value);
  if (dup) return { snapshot, status: 'duplicate', message: 'Duplicate observation ignored (same metric, time and value).', diff: [] };

  const current = snapshot.metrics[obs.code];
  if (current && Date.parse(obs.ts) < Date.parse(current.ts)) {
    return { snapshot, status: 'late', message: 'Late-arriving observation stored in history; current state keeps the newer value.', diff: [] };
  }

  const before = current?.value ?? null;
  const prev = current?.value;
  const trend = prev == null ? 'new' : obs.value > prev ? 'up' : obs.value < prev ? 'down' : 'flat';
  const next = {
    ...snapshot,
    version: snapshot.version + 1,
    generatedAt: new Date().toISOString(),
    latestObservationAt: obs.ts,
    metrics: { ...snapshot.metrics, [obs.code]: { value: obs.value, unit: obs.unit, ts: obs.ts, source: obs.source, trend, status: statusOf(obs.code, obs.value) } },
    missing: snapshot.missing.filter((f) => f !== obs.code),
    note: `${METRICS[obs.code].label} updated`,
  };
  return {
    snapshot: next, status: 'applied',
    message: `Twin state advanced to v${next.version}.`,
    diff: [{ field: METRICS[obs.code].label, before, after: obs.value, unit: obs.unit }],
  };
}

/** Seeded history so the replay slider has something real to replay (all synthetic). */
export function seedHistory() {
  const seeds = [
    { code: 'heartRate', value: 68, ts: '2026-10-15T06:10:00.000Z' }, { code: 'systolic', value: 118, ts: '2026-10-15T06:10:00.000Z' },
    { code: 'diastolic', value: 78, ts: '2026-10-15T06:10:00.000Z' }, { code: 'glucose', value: 92, ts: '2026-10-15T06:30:00.000Z' },
    { code: 'spo2', value: 98, ts: '2026-10-15T06:30:00.000Z' }, { code: 'sleep', value: 7.1, ts: '2026-10-15T06:00:00.000Z' },
    { code: 'steps', value: 3200, ts: '2026-10-15T20:00:00.000Z' },
    { code: 'heartRate', value: 72, ts: '2026-10-17T08:00:00.000Z' }, { code: 'glucose', value: 95, ts: '2026-10-17T08:05:00.000Z' },
    { code: 'sleep', value: 7.5, ts: '2026-10-17T06:00:00.000Z' }, { code: 'steps', value: 4230, ts: '2026-10-17T18:00:00.000Z' },
    { code: 'systolic', value: 120, ts: '2026-10-17T08:00:00.000Z' }, { code: 'diastolic', value: 80, ts: '2026-10-17T08:00:00.000Z' },
  ];
  let snap = emptySnapshot();
  const log = [];
  const snapshots = [snap];
  for (const s of seeds) {
    const obs = { id: `seed-${log.length}`, patientId: 'P-001', unit: METRICS[s.code].unit, source: 'Synthetic wearable', ...s };
    const r = applyObservation(snap, obs, log);
    if (r.status === 'applied') { snap = r.snapshot; snapshots.push(snap); log.push(obs); }
  }
  return { snapshots, log };
}

export function freshness(iso, now = Date.now()) {
  if (!iso) return 'no data';
  const mins = Math.max(0, Math.round((now - Date.parse(iso)) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return `${Math.round(mins / 1440)} d ago`;
}
