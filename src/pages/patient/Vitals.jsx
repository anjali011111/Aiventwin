import { useState } from 'react';
import { Heart, Activity, Droplet, Wind, Moon, Footprints } from 'lucide-react';
import { PageHeader, Card, Badge, Tabs } from '../../components/ui';
import { Sparkline, TrendChart } from '../../components/charts/Charts';
import { useTwin } from '../../app/TwinProvider';
import { METRICS, freshness } from '../../lib/twinEngine';
import { vitalSeries, trend6m } from '../../data/mock';

const cards = [
  { code: 'heartRate', icon: Heart, color: '#4636FC' }, { code: 'systolic', icon: Activity, color: '#5170FD' },
  { code: 'glucose', icon: Droplet, color: '#5170FD' }, { code: 'spo2', icon: Wind, color: '#60ABFB' },
  { code: 'sleep', icon: Moon, color: '#5170FD' }, { code: 'steps', icon: Footprints, color: '#1F9D6B' },
];
const tone = { normal: 'ok', high: 'warn', low: 'warn' };

export default function Vitals() {
  const { latest } = useTwin();
  const [range, setRange] = useState('6m');
  const data = range === '6m' ? trend6m : trend6m.slice(-3);

  return (
    <>
      <PageHeader title="Vitals & wearable observations" subtitle="Latest values come from the Twin snapshot. Add observations on the Digital Twin page and they appear here." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ code, icon: Icon, color }) => {
          const m = latest.metrics[code]; const meta = METRICS[code];
          return (
            <Card key={code} className="p-5">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-medium text-navy"><Icon size={18} style={{ color }} aria-hidden />{meta.label}</span>{m && <Badge tone={tone[m.status] ?? 'neutral'}>{m.status}</Badge>}</div>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">{m ? m.value.toLocaleString() : '—'} <span className="text-sm font-normal text-subtle">{meta.unit}</span></p>
              <p className="text-xs text-subtle">{m ? `${m.source} · ${freshness(m.ts)}` : 'No observation yet'}</p>
              <div className="mt-2"><Sparkline values={vitalSeries[code] ?? [1, 2, 3]} color={color} label={`${meta.label} recent trend`} /></div>
            </Card>);
        })}
      </div>
      <Card className="mt-5 p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-navy">Trends</h2><Tabs tabs={[{ id: '6m', label: '6 months' }, { id: '3m', label: '3 months' }]} value={range} onChange={setRange} /></div>
        <TrendChart label="Heart rate, systolic BP and glucose trends" data={data} lines={[{ key: 'heartRate', name: 'Heart rate', color: '#4636FC' }, { key: 'systolic', name: 'Systolic BP', color: '#5170FD' }, { key: 'glucose', name: 'Glucose', color: '#5170FD' }]} height={280} />
      </Card>
    </>
  );
}
