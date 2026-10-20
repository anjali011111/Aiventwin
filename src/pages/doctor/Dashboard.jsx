import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ClipboardCheck, AlertTriangle, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { PageHeader, Card, Badge, Button } from '../../components/ui';
import { MovableGrid } from '../../components/twin/Movable';
import { TrendChart } from '../../components/charts/Charts';
import { useTwin } from '../../app/TwinProvider';
import { clinicianPatients, cohortTrend, consultSummary, predictionQueue } from '../../data/mock';

const tone = { Low: 'ok', Moderate: 'warn', High: 'risk' };

export default function DoctorDashboard() {
  const { events, latest } = useTwin();
  const [regen, setRegen] = useState(false);
  const stats = [
    { l: 'Patients', v: clinicianPatients.length, i: Users }, { l: 'Pending reviews', v: predictionQueue.length, i: ClipboardCheck },
    { l: 'High risk', v: clinicianPatients.filter((p) => p.risk === 'High').length, i: AlertTriangle }, { l: 'Stale data (≥ 3 d)', v: 1, i: Clock },
  ];

  const items = [
    { id: 'queue', span: 'xl:col-span-2', node: (
      <Card className="h-full p-5"><h2 className="font-semibold text-navy">Priority patients</h2>
        <div className="mt-3 overflow-x-auto scroll-thin"><table className="w-full min-w-[460px] text-sm"><caption className="sr-only">Patients sorted by risk</caption>
          <thead><tr className="text-left text-xs text-subtle"><th className="py-1.5 font-semibold">Patient</th><th className="font-semibold">Condition</th><th className="font-semibold">Risk</th><th className="font-semibold">Last data</th><th /></tr></thead>
          <tbody>{[...clinicianPatients].sort((a, b) => ['High', 'Moderate', 'Low'].indexOf(a.risk) - ['High', 'Moderate', 'Low'].indexOf(b.risk)).slice(0, 5).map((p) => (
            <tr key={p.id} className="border-t border-line"><td className="py-2.5 font-medium text-navy">{p.name}<span className="block text-xs font-normal text-subtle">{p.id}</span></td><td>{p.condition}</td><td><Badge tone={tone[p.risk]}>{p.risk}</Badge></td><td className="text-subtle">{p.fresh} ago</td><td><Link to={`/doctor/patients/${p.id}`} aria-label={`Open ${p.name}`} className="text-bluex"><ChevronRight size={18} /></Link></td></tr>))}</tbody></table></div>
      </Card>) },
    { id: 'summary', node: (
      <Card className="h-full p-5"><div className="flex items-center justify-between pr-8"><h2 className="font-semibold text-navy">AI consultation summary</h2></div>
        <p className="text-xs text-subtle">Priya Reddy · generated from Twin v{latest.version} · decision support, needs review</p>
        <ul className={`mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink ${regen ? 'opacity-40' : ''}`}>{consultSummary.map((s) => <li key={s}>{s}</li>)}</ul>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => { setRegen(true); setTimeout(() => setRegen(false), 900); }}><RefreshCw size={14} className={regen ? 'animate-spin' : ''} aria-hidden /> Regenerate (demo)</Button>
      </Card>) },
    { id: 'cohort', span: 'xl:col-span-2', node: (
      <Card className="h-full p-5"><div className="pr-8"><h2 className="font-semibold text-navy">Cohort trend</h2><p className="text-xs text-subtle">Average heart rate and glucose across synthetic patients</p></div>
        <div className="mt-3"><TrendChart label="Cohort average heart rate and glucose" data={cohortTrend} lines={[{ key: 'avgHR', name: 'Avg heart rate', color: '#4636FC' }, { key: 'avgGlucose', name: 'Avg glucose', color: '#5170FD' }]} /></div></Card>) },
    { id: 'audit', node: (
      <Card className="h-full p-5"><h2 className="font-semibold text-navy">Recent audit events</h2>
        {events.length === 0 ? <p className="mt-3 text-sm text-subtle">No events yet. Add an observation or review a prediction to see entries here.</p> :
          <ul className="mt-3 divide-y divide-line text-sm">{events.slice(0, 6).map((e, i) => <li key={i} className="py-2.5"><p className="font-medium text-navy">{e.action}</p><p className="text-xs text-subtle">{e.detail} · {e.at.slice(11, 19)} UTC</p></li>)}</ul>}</Card>) },
  ];

  return (
    <>
      <PageHeader title="Good day, Dr. Sharma" subtitle="Your authorised patients and items awaiting review. Rearrange widgets to suit your workflow." />
      <div className="card mb-5 grid grid-cols-2 lg:grid-cols-4">{stats.map(({ l, v, i: Icon }, n) => (
        <div key={l} className={`flex items-center gap-3 border-line px-5 py-4 ${n % 2 === 1 ? 'border-l' : ''} ${n >= 2 ? 'border-t lg:border-t-0' : ''} ${n > 0 ? 'lg:border-l' : ''}`}>
          <Icon size={18} className="shrink-0 text-brand-3" aria-hidden /><span><span className="block text-2xl font-semibold tabular-nums text-navy">{v}</span><span className="text-xs text-subtle">{l}</span></span>
        </div>))}</div>
      <MovableGrid items={items} storageKey="aevitwin.doctor.dashboard.v1" cols="xl:grid-cols-3 md:grid-cols-2" />
    </>
  );
}
