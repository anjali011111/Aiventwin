import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, FlaskConical, Pill, HeartPulse, Play, Pause, RotateCcw } from 'lucide-react';
import { PageHeader, Card, Button, Tabs, ListSkeleton, ErrorState } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';

const kinds = { visit: [User, 'bg-bluex/10 text-bluex'], lab: [FlaskConical, 'bg-emerald-50 text-ok'], rx: [Pill, 'bg-red-50 text-risk'], ecg: [HeartPulse, 'bg-violet-50 text-violet-600'] };
const filters = [{ id: 'all', label: 'All' }, { id: 'visit', label: 'Visits' }, { id: 'lab', label: 'Labs' }, { id: 'rx', label: 'Prescriptions' }, { id: 'ecg', label: 'ECG' }];

export default function Timeline() {
  const { loading, error, data, reload } = useApi(api.getTimeline, []);
  const [f, setF] = useState('all');
  const [step, setStep] = useState(-1); // replay cursor (oldest → newest)
  const [playing, setPlaying] = useState(false);
  const list = (data ?? []).filter((t) => f === 'all' || t.kind === f);
  const ordered = [...list].reverse();

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => setStep((s) => { if (s >= ordered.length - 1) { setPlaying(false); return s; } return s + 1; }), 900);
    return () => clearInterval(t);
  }, [playing, ordered.length]);

  const visibleSet = step < 0 ? null : new Set(ordered.slice(0, step + 1).map((o) => o.id));

  return (
    <>
      <PageHeader title="Health timeline" subtitle="Your longitudinal history. Replay it from the oldest event to today."
        actions={<>
          <Button variant="outline" onClick={() => { setStep(-1); setPlaying(false); }}><RotateCcw size={15} aria-hidden /> Show all</Button>
          <Button variant="cyan" onClick={() => { if (playing) return setPlaying(false); setStep(0); setPlaying(true); }}>{playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}{playing ? 'Pause' : 'Replay'}</Button></>} />
      <Tabs tabs={filters} value={f} onChange={(v) => { setF(v); setStep(-1); setPlaying(false); }} className="mb-5" />
      {loading ? <ListSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <Card className="p-6">
          <ol className="relative space-y-6 border-l-2 border-line pl-8">
            {list.map((t) => {
              const [Icon, cls] = kinds[t.kind]; const hidden = visibleSet && !visibleSet.has(t.id);
              return (
                <motion.li key={t.id} layout animate={{ opacity: hidden ? 0.18 : 1, x: hidden ? -8 : 0 }} className="relative">
                  <span className={`absolute -left-[3.05rem] grid h-9 w-9 place-items-center rounded-full ring-4 ring-white ${cls}`}><Icon size={17} aria-hidden /></span>
                  <p className="text-xs font-medium text-subtle">{t.date}</p><p className="font-semibold text-navy">{t.title}</p><p className="text-sm text-subtle">{t.sub}</p>
                </motion.li>);
            })}
          </ol>
        </Card>
      )}
    </>
  );
}
