import { useState } from 'react';
import { Search, Star, CheckCircle2 } from 'lucide-react';
import { PageHeader, Card, Button, Modal, Badge, ListSkeleton, ErrorState, EmptyState } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { upcoming } from '../../data/mock';

const specialties = ['All', 'General Physician', 'Cardiologist', 'Endocrinologist'];

export default function Appointments() {
  const { loading, error, data, reload } = useApi(api.getDoctors, []);
  const [q, setQ] = useState('');
  const [spec, setSpec] = useState('All');
  const [pick, setPick] = useState(null); // { doctor, slot }
  const [booked, setBooked] = useState([]);
  const [done, setDone] = useState(false);

  const list = (data ?? []).filter((d) => (spec === 'All' || d.specialty === spec) && `${d.name} ${d.specialty}`.toLowerCase().includes(q.toLowerCase()));
  const confirm = () => { setBooked((b) => [...b, { id: `b${b.length}`, doctor: pick.doctor.name, specialty: pick.doctor.specialty, when: `Next available · ${pick.slot}`, reason: 'New booking (demo)' }]); setDone(true); };
  const close = () => { setPick(null); setDone(false); };

  return (
    <>
      <PageHeader title="Book appointment" subtitle="Find doctors, check availability and book. Bookings here are demo-only." />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden /><input aria-label="Search doctor or specialty" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctor or specialty" className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm" /></div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">{specialties.map((s) => <button key={s} aria-pressed={spec === s} onClick={() => setSpec(s)} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${spec === s ? 'border-navy bg-navy text-white' : 'border-line bg-white text-subtle hover:bg-slate-50'}`}>{s}</button>)}</div>
          <div className="mt-5 space-y-4">
            {loading ? <ListSkeleton rows={3} /> : error ? <ErrorState message={error} onRetry={reload} /> : list.length === 0 ? <EmptyState title="No doctors match your search" /> : list.map((d) => (
              <Card key={d.id} className="p-5">
                <div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy text-lg font-semibold text-white" aria-hidden>{d.name.split(' ').slice(-1)[0][0]}</span>
                  <div className="flex-1"><h2 className="font-semibold text-navy">{d.name}</h2><p className="text-sm text-subtle">{d.specialty}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-subtle"><Star size={13} className="fill-amber-400 text-amber-400" aria-hidden />{d.rating} ({d.reviews} reviews) · synthetic profile</p></div></div>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={`Available slots for ${d.name}`}>{d.slots.map((s) => <button key={s} onClick={() => setPick({ doctor: d, slot: s })} className="rounded-lg border border-bluex/30 bg-bluex/5 px-3 py-1.5 text-sm font-medium text-bluex hover:bg-bluex hover:text-white">{s}</button>)}</div>
              </Card>))}
          </div>
        </div>
        <aside><Card className="p-5"><h2 className="font-semibold text-navy">Upcoming</h2>
          <ul className="mt-3 divide-y divide-line">{[...upcoming, ...booked].map((a) => <li key={a.id} className="py-3 text-sm"><p className="font-semibold text-navy">{a.doctor}</p><p className="text-xs text-subtle">{a.specialty}</p><p className="mt-1">{a.when}</p>{a.id.startsWith('b') && <Badge tone="info" className="mt-1">Demo booking</Badge>}</li>)}</ul></Card></aside>
      </div>

      <Modal open={!!pick} onClose={close} title={done ? 'Booked (demo)' : 'Confirm appointment'}>
        {done ? (<div className="text-center" role="status"><CheckCircle2 size={44} className="mx-auto text-ok" aria-hidden /><p className="mt-3 text-sm text-subtle">Your demo appointment with {pick?.doctor.name} at {pick?.slot} was added to Upcoming. No real booking was made.</p><Button className="mt-4 w-full" onClick={close}>Done</Button></div>) : (
          <><p className="text-sm text-subtle">Book <strong className="text-navy">{pick?.doctor.name}</strong> ({pick?.doctor.specialty}) at <strong className="text-navy">{pick?.slot}</strong>?</p><div className="mt-5 flex gap-2"><Button variant="outline" className="flex-1" onClick={close}>Cancel</Button><Button variant="blue" className="flex-1" onClick={confirm}>Confirm</Button></div></>)}
      </Modal>
    </>
  );
}
