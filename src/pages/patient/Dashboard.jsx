import { Link } from 'react-router-dom';
import { Heart, Droplet, Moon, Footprints, Activity, FileText, CalendarDays, Pill, Bot, Lightbulb, FlaskConical, ChevronRight } from 'lucide-react';
import { PageHeader, Card, Badge, Button } from '../../components/ui';
import { MovableGrid } from '../../components/twin/Movable';
import BodyTwin from '../../components/twin/BodyTwin';
import { TrendChart, RiskBar } from '../../components/charts/Charts';
import { useTwin } from '../../app/TwinProvider';
import { freshness } from '../../lib/twinEngine';
import { patient, trend6m, upcoming, risks, records } from '../../data/mock';

const quick = [
  { to: '/patient/records', label: 'My Records', icon: FileText }, { to: '/patient/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/patient/medications', label: 'Medications', icon: Pill }, { to: '/patient/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/patient/insights', label: 'Health Insights', icon: Lightbulb }, { to: '/patient/digital-twin', label: 'Digital Twin', icon: Activity },
];

export default function PatientDashboard() {
  const { latest } = useTwin();
  const m = latest.metrics;
  const rows = [
    ['Heart Rate', m.heartRate ? `${m.heartRate.value} bpm` : '—', Heart, '#4636FC'],
    ['Blood Pressure', m.systolic && m.diastolic ? `${m.systolic.value}/${m.diastolic.value} mmHg` : '—', Activity, '#60ABFB'],
    ['Blood Sugar', m.glucose ? `${m.glucose.value} mg/dL` : '—', Droplet, '#5170FD'],
    ['Sleep', m.sleep ? `${m.sleep.value} hrs` : '—', Moon, '#5170FD'],
    ['Activity', m.steps ? `${m.steps.value.toLocaleString()} steps` : '—', Footprints, '#5170FD'],
  ];

  const items = [
    {
      id: 'summary', span: 'xl:row-span-2',
      node: (
        <Card className="h-full p-5">
          <h2 className="font-semibold text-navy">Your health summary</h2>
          <div className="mt-4 grid grid-cols-[120px_1fr] items-center gap-5">
            <BodyTwin className="h-[24rem] w-full" pulseKey={latest.version} />
            <ul className="divide-y divide-line">
              {rows.map(([l, v, Icon]) => (
                <li key={l} className="flex items-center gap-3 py-3.5"><Icon size={18} className="shrink-0 text-brand-3" aria-hidden /><span><span className="block text-xs text-subtle">{l}</span><span className="text-sm font-semibold tabular-nums text-navy">{v}</span></span></li>))}
            </ul>
          </div>
          <p className="mt-4 border-t border-line pt-3 text-xs text-subtle">Twin v{latest.version} · updated {freshness(latest.latestObservationAt)} · synthetic demo values, not a medical device.</p>
        </Card>
      ),
    },
    {
      id: 'quick',
      node: (
        <Card className="h-full p-5"><h2 className="font-semibold text-navy">Quick access</h2>
          <div className="mt-2 grid grid-cols-2 gap-x-6 divide-y-0">
            {quick.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-2.5 rounded-md py-2.5 text-sm font-medium text-navy transition-colors hover:text-brand-4">
                <Icon size={18} className="text-brand-3" aria-hidden />{label}</Link>))}
          </div>
        </Card>
      ),
    },
    {
      id: 'appt',
      node: (
        <Card className="h-full p-5"><h2 className="font-semibold text-navy">Next appointment</h2>
          {upcoming.map((a) => (<div key={a.id} className="mt-3 border-t border-line pt-3"><p className="font-semibold text-navy">{a.doctor}</p><p className="text-xs text-subtle">{a.specialty}</p><p className="mt-2 text-sm text-navy">{a.when}</p><p className="text-xs text-subtle">{a.reason}</p></div>))}
          <Button to="/patient/appointments" variant="outline" size="sm" className="mt-3">Manage <ChevronRight size={14} aria-hidden /></Button>
        </Card>
      ),
    },
    {
      id: 'trend', span: 'md:col-span-2',
      node: (
        <Card className="h-full p-5"><div className="flex items-center justify-between pr-8"><h2 className="font-semibold text-navy">Trends (last 6 months)</h2><Badge tone="info">Synthetic</Badge></div>
          <div className="mt-3"><TrendChart label="Heart rate and systolic blood pressure over six months" data={trend6m} lines={[{ key: 'heartRate', name: 'Heart rate (bpm)', color: '#4636FC' }, { key: 'systolic', name: 'Systolic BP (mmHg)', color: '#5170FD' }]} /></div>
        </Card>
      ),
    },
    {
      id: 'risk',
      node: (
        <Card className="h-full p-5"><div className="flex items-center gap-2 pr-8"><h2 className="font-semibold text-navy">Risk snapshot</h2></div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle"><FlaskConical size={12} aria-hidden /> Illustrative values, not a validated model output.</p>
          <div className="mt-4 space-y-4">{risks.map((r) => <RiskBar key={r.id} {...r} />)}</div>
        </Card>
      ),
    },
    {
      id: 'recent',
      node: (
        <Card className="h-full p-5"><h2 className="font-semibold text-navy">Recent records</h2>
          <ul className="mt-3 divide-y divide-line">
            {records.slice(0, 4).map((r) => (<li key={r.id} className="flex items-center justify-between py-2.5 text-sm"><span><span className="block font-medium text-navy">{r.title}</span><span className="text-xs text-subtle">{r.date}</span></span>{r.status !== 'View' && <Badge tone={r.status === 'High' ? 'risk' : 'ok'}>{r.status}</Badge>}</li>))}
          </ul>
        </Card>
      ),
    },
  ];

  return (
    <>
      <PageHeader title={`Hello, ${patient.first}`} subtitle="Take charge of your health today. Rearrange this dashboard however you like." />
      <MovableGrid items={items} storageKey="aevitwin.patient.dashboard.v1" />
    </>
  );
}
