import { useState } from 'react';
import { Pill } from 'lucide-react';
import { PageHeader, Card, Badge, Tabs, ListSkeleton, ErrorState, EmptyState, Disclaimer } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';

export default function Medications() {
  const { loading, error, data, reload } = useApi(api.getMedications, []);
  const [tab, setTab] = useState('Active');
  const list = (data ?? []).filter((m) => tab === 'All' || m.status === tab);
  return (
    <>
      <PageHeader title="Medication history" subtitle="Current and past medicines recorded for you." />
      <Tabs tabs={['Active', 'Completed', 'All']} value={tab} onChange={setTab} className="mb-4" />
      {loading ? <ListSkeleton rows={3} /> : error ? <ErrorState message={error} onRetry={reload} /> : list.length === 0 ? <EmptyState title="Nothing here" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((m) => (
            <Card key={m.id} className="p-5">
              <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-risk"><Pill size={20} aria-hidden /></span><div><h2 className="font-semibold text-navy">{m.name} <span className="font-normal text-subtle">{m.dose}</span></h2><p className="text-xs text-subtle">{m.for}</p></div></div><Badge tone={m.status === 'Active' ? 'ok' : 'neutral'}>{m.status}</Badge></div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm"><div><dt className="text-xs text-subtle">Frequency</dt><dd>{m.freq}</dd></div><div><dt className="text-xs text-subtle">Period</dt><dd>{m.start}{m.end ? ` → ${m.end}` : ' → ongoing'}</dd></div></dl>
            </Card>))}
        </div>
      )}
      <div className="mt-6"><Disclaimer>This list is a record, not prescribing advice. Always follow the instructions of your clinician and pharmacist.</Disclaimer></div>
    </>
  );
}
