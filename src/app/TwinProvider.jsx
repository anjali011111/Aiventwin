import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { applyObservation, makeObservation, seedHistory } from '../lib/twinEngine';

const TwinCtx = createContext(null);

/**
 * Session-wide synthetic Twin for patient P-001. Adding an observation on the Twin page
 * updates the dashboard, vitals and clinician views too — a preview of how the real
 * backend snapshot will flow through the app.
 */
export function TwinProvider({ children }) {
  const [store, setStore] = useState(seedHistory);
  const storeRef = useRef(store);
  const [events, setEvents] = useState([]); // audit-style event feed (UI only)

  const submit = useCallback((input) => {
    const cur = storeRef.current;
    const current = cur.snapshots[cur.snapshots.length - 1];
    const obs = makeObservation(input);
    const result = applyObservation(current, obs, cur.log);
    if (result.status === 'rejected' || result.status === 'duplicate') return result;
    const next = {
      log: [obs, ...cur.log], // the raw log only ever grows (immutable history)
      snapshots: result.status === 'applied' ? [...cur.snapshots, result.snapshot] : cur.snapshots,
    };
    storeRef.current = next;
    setStore(next);
    return result;
  }, []);

  const logEvent = useCallback((e) => setEvents((ev) => [{ at: new Date().toISOString(), ...e }, ...ev].slice(0, 50)), []);

  const value = useMemo(() => ({
    snapshots: store.snapshots, log: store.log, latest: store.snapshots[store.snapshots.length - 1], submit, events, logEvent,
  }), [store, submit, events, logEvent]);

  return <TwinCtx.Provider value={value}>{children}</TwinCtx.Provider>;
}

export const useTwin = () => useContext(TwinCtx);
