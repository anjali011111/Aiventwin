import { useCallback, useEffect, useState } from 'react';

/** Tiny data hook that exposes loading / error / data / reload for every service call. */
export function useApi(fn, deps = []) {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fn().then((data) => setState({ loading: false, error: null, data }))
      .catch((e) => setState({ loading: false, error: e?.message ?? 'Request failed', data: null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}
