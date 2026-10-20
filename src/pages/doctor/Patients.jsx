import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageHeader, Card, Badge, ListSkeleton, ErrorState, EmptyState } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';

const tone = { Low: 'ok', Moderate: 'warn', High: 'risk' };

export default function Patients() {
  const { loading, error, data, reload } = useApi(api.getPatients, []);
  const [q, setQ] = useState('');
  const [risk, setRisk] = useState('All');
  const list = (data ?? []).filter((p) => (risk === 'All' || p.risk === risk) && `${p.name} ${p.id} ${p.condition}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="Patients" subtitle="Only patients you are authorised to see are listed (enforced by the backend in production)." />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden /><input aria-label="Search patients" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, ID or condition" className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm" /></div>
        <label className="sr-only" htmlFor="risk">Filter by risk</label>
        <select id="risk" value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm">{['All', 'Low', 'Moderate', 'High'].map((r) => <option key={r}>{r}</option>)}</select>
      </div>
      {loading ? <ListSkeleton rows={6} /> : error ? <ErrorState message={error} onRetry={reload} /> : list.length === 0 ? <EmptyState title="No patients match" text="Try a different search or filter." /> : (
        <Card className="overflow-x-auto scroll-thin"><table className="w-full min-w-[640px] text-sm"><caption className="sr-only">Authorised patients</caption>
          <thead><tr className="bg-mist text-left text-xs text-subtle"><th className="px-4 py-3 font-semibold">Patient</th><th className="font-semibold">Age / sex</th><th className="font-semibold">Condition</th><th className="font-semibold">Risk</th><th className="font-semibold">Twin</th><th className="font-semibold">Last data</th></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p.id} className="border-t border-line hover:bg-mist/60"><td className="px-4 py-3"><Link to={`/doctor/patients/${p.id}`} className="font-semibold text-navy hover:text-bluex">{p.name}</Link><span className="block text-xs text-subtle">{p.id}</span></td><td>{p.age} · {p.sex}</td><td>{p.condition}</td><td><Badge tone={tone[p.risk]}>{p.risk}</Badge></td><td className="tabular-nums">{p.twin}</td><td className="text-subtle">{p.fresh} ago</td></tr>))}</tbody></table></Card>)}
    </>
  );
}
