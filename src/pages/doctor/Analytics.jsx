import { PageHeader, Card, Badge } from '../../components/ui';
import { TrendChart, SimpleBars } from '../../components/charts/Charts';
import { cohortTrend, riskDistribution, clinicianPatients } from '../../data/mock';

export default function Analytics() {
  return (
    <>
      <PageHeader title="Trends & analytics" subtitle="Cohort-level views over a synthetic population of eight patients." />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <Card className="p-5"><h2 className="font-semibold text-navy">Cohort averages</h2><div className="mt-3"><TrendChart label="Cohort average heart rate and glucose by month" data={cohortTrend} lines={[{ key: 'avgHR', name: 'Avg heart rate', color: '#4636FC' }, { key: 'avgGlucose', name: 'Avg glucose', color: '#5170FD' }]} height={260} /></div></Card>
        <Card className="p-5"><h2 className="font-semibold text-navy">Risk distribution</h2><div className="mt-3"><SimpleBars label="Number of patients per risk level" data={riskDistribution} xKey="level" yKey="n" colors={['#1F9D6B', '#D9822B', '#D64545']} height={260} /></div></Card>
        <Card className="p-5 lg:col-span-2"><div className="flex items-center justify-between"><h2 className="font-semibold text-navy">Data freshness by patient</h2><Badge tone="info">Provenance-aware</Badge></div>
          <p className="mt-1 text-xs text-subtle">Stale Twin state weakens predictions, so freshness is shown next to every patient.</p>
          <div className="mt-4 overflow-x-auto scroll-thin"><table className="w-full min-w-[420px] text-sm"><caption className="sr-only">Twin version and data age per patient</caption>
            <thead><tr className="text-left text-xs text-subtle"><th className="py-1.5 font-semibold">Patient</th><th className="font-semibold">Twin version</th><th className="font-semibold">Last observation</th></tr></thead>
            <tbody>{clinicianPatients.map((p) => <tr key={p.id} className="border-t border-line"><td className="py-2.5 font-medium text-navy">{p.name}</td><td className="tabular-nums">{p.twin}</td><td className={p.fresh.endsWith('d') && parseInt(p.fresh, 10) >= 3 ? 'font-medium text-warn' : 'text-subtle'}>{p.fresh} ago</td></tr>)}</tbody></table></div></Card>
      </div>
    </>
  );
}
