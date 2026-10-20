import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Tabs, Disclaimer, Skeleton, EmptyState } from '../../components/ui';
import BodyTwin from '../../components/twin/BodyTwin';
import { TrendChart, RiskBar } from '../../components/charts/Charts';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { useTwin } from '../../app/TwinProvider';
import { organs, trend6m, timeline, consultSummary, risks, patient as demoPatient } from '../../data/mock';

const tabs = [{ id: 'body', label: 'Body View' }, { id: 'vitals', label: 'Vitals' }, { id: 'timeline', label: 'Timeline' }, { id: 'risk', label: 'Risk Analysis' }, { id: 'ai', label: 'AI Summary' }];

export default function PatientDetail() {
  const { patientId } = useParams();
  const { loading, data: p } = useApi(() => api.getPatient(patientId), [patientId]);
  const { latest } = useTwin();
  const [tab, setTab] = useState('body');
  const [organ, setOrgan] = useState('heart');
  const live = patientId === 'P-001';

  if (loading) return <Skeleton className="h-96" />;
  if (!p) return <EmptyState title="Patient not found or not authorised" text="In production the API returns 404 for patients outside your access list." />;
  const m = latest.metrics;

  return (
    <>
      <Link to="/doctor/patients" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-bluex"><ArrowLeft size={15} aria-hidden /> All patients</Link>
      <PageHeader title={p.name} subtitle={`${p.id} · ${p.age} y · ${p.condition}`} actions={<><Button variant="outline">View full profile</Button><Button variant="success">Start consultation</Button></>} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <Card className="p-5 xl:self-start"><div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-full bg-navy text-lg font-semibold text-white" aria-hidden>{p.name[0]}</span><div><p className="font-semibold text-navy">{p.name}</p><Badge tone="ok">Active</Badge></div></div>
          <dl className="mt-5 space-y-3 text-sm">{[['Blood group', live ? demoPatient.blood : '—'], ['Allergies', live ? demoPatient.allergies : '—'], ['Chronic conditions', p.condition], ['Last visit', live ? demoPatient.lastVisit : '—'], ['Twin version', p.twin]].map(([k, v]) => <div key={k} className="flex justify-between gap-3 border-t border-line pt-3 first:border-0 first:pt-0"><dt className="text-subtle">{k}</dt><dd className="text-right font-medium text-navy">{v}</dd></div>)}</dl></Card>

        <Card className="p-5"><h2 className="mb-3 font-semibold text-navy">Patient Digital Twin</h2><Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-4" />
          {!live && <div className="mb-4"><Disclaimer>Detailed Twin simulation exists only for P-001 in this prototype. Other patients show list-level data.</Disclaimer></div>}
          {tab === 'body' && (<div className="grid gap-4 sm:grid-cols-[180px_1fr]"><div><BodyTwin selected={organ} onSelect={setOrgan} className="mx-auto h-72" pulseKey={latest.version} /></div>
            <div><h3 className="flex items-center gap-2 font-semibold text-navy"><Heart size={18} className="text-risk" aria-hidden />{organs[organ].name}</h3><p className="text-xs text-subtle">{organs[organ].system}</p>
              <ul className="mt-3 divide-y divide-line text-sm">{(organ === 'heart' && live ? [['Heart rate', m.heartRate ? `${m.heartRate.value} bpm` : '—', m.heartRate?.status], ['Blood pressure', m.systolic ? `${m.systolic.value}/${m.diastolic?.value} mmHg` : '—', m.systolic?.status]] : organs[organ].metrics).map(([k, v, s]) => <li key={k} className="flex items-center justify-between py-2"><span className="text-subtle">{k}</span><span className="flex items-center gap-2 tabular-nums font-medium">{v}<Badge tone="ok">{s ?? 'normal'}</Badge></span></li>)}</ul>
              <p className="mt-3 text-xs text-subtle">{organs[organ].note}</p></div></div>)}
          {tab === 'vitals' && <TrendChart label="Heart rate and blood pressure trend" data={trend6m} lines={[{ key: 'heartRate', name: 'Heart rate', color: '#4636FC' }, { key: 'systolic', name: 'Blood pressure', color: '#5170FD' }]} height={280} />}
          {tab === 'timeline' && <ol className="divide-y divide-line text-sm">{timeline.map((t) => <li key={t.id} className="flex gap-3 py-3"><span className="w-24 shrink-0 text-xs text-subtle">{t.date}</span><span><span className="block font-medium text-navy">{t.title}</span><span className="text-subtle">{t.sub}</span></span></li>)}</ol>}
          {tab === 'risk' && <div className="space-y-5">{risks.map((r) => <RiskBar key={r.id} {...r} />)}<p className="text-xs text-subtle">Illustrative values. No validated model.</p></div>}
          {tab === 'ai' && <ul className="list-disc space-y-1.5 pl-5 text-sm">{consultSummary.map((s) => <li key={s}>{s}</li>)}</ul>}
        </Card>

        <div className="space-y-5">
          <Card className="p-5"><h2 className="font-semibold text-navy">AI consultation summary</h2><p className="text-xs text-subtle">Decision support — requires clinician review</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">{consultSummary.slice(0, 4).map((s) => <li key={s}>{s}</li>)}</ul></Card>
          <Card className="p-5"><h2 className="font-semibold text-navy">Patient timeline</h2>
            <ol className="mt-3 space-y-3 text-sm">{timeline.slice(0, 4).map((t) => <li key={t.id}><p className="text-xs text-subtle">{t.date}</p><p className="font-medium text-navy">{t.title}</p><p className="text-xs text-subtle">{t.sub}</p></li>)}</ol></Card>
        </div>
      </div>
    </>
  );
}
