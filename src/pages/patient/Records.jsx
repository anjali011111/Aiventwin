import { useState } from 'react';
import { FileText, FlaskConical, ScanLine, Pill, Stethoscope, Upload, AlertTriangle } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Tabs, Modal, ListSkeleton, ErrorState, EmptyState, Disclaimer } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';

const icon = { Lab: FlaskConical, Imaging: ScanLine, Prescription: Pill, Visit: Stethoscope };
const tabs = ['All', 'Lab', 'Imaging', 'Prescription', 'Visit'];

export default function Records() {
  const { loading, error, data, reload } = useApi(api.getRecords, []);
  const [tab, setTab] = useState('All');
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const list = (data ?? []).filter((r) => tab === 'All' || r.type === tab);

  return (
    <>
      <PageHeader title="My Health Records" subtitle="Lab reports, prescriptions and visit history." actions={<Button variant="blue" onClick={() => setOpen(true)}><Upload size={16} aria-hidden /> Upload new report</Button>} />
      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-4" />
      {loading ? <ListSkeleton /> : error ? <ErrorState message={error} onRetry={reload} /> : list.length === 0 ? <EmptyState title="No records in this category" /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((r) => { const Icon = icon[r.type] ?? FileText; return (
            <button key={r.id} onClick={() => setSel(r)} className="text-left">
              <Card className="flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-bluex/10 text-bluex"><Icon size={20} aria-hidden /></span>
                <span className="flex-1"><span className="block font-semibold text-navy">{r.title}</span><span className="text-xs text-subtle">{r.type} · {r.date}</span></span>
                {r.status !== 'View' ? <Badge tone={r.status === 'High' ? 'risk' : 'ok'}>{r.status}</Badge> : <span className="text-sm font-medium text-bluex">View</span>}
              </Card></button>); })}
        </div>
      )}

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.title ?? ''}>
        <dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-subtle">Type</dt><dd>{sel?.type}</dd></div><div className="flex justify-between"><dt className="text-subtle">Date</dt><dd>{sel?.date}</dd></div><div className="flex justify-between"><dt className="text-subtle">Flag</dt><dd>{sel?.status}</dd></div></dl>
        <p className="mt-4 border-t border-line pt-3 text-xs text-subtle">Report content is not available in this prototype; the real viewer will render the stored document or FHIR resource.</p>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)} title="Upload new report">
        <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle size={16} className="shrink-0" aria-hidden />Uploads are disabled in this prototype. Never upload real patient records to a demo or public build.</div>
        <Button className="mt-4 w-full" variant="outline" onClick={() => setOpen(false)}>Close</Button>
      </Modal>
      <div className="mt-6"><Disclaimer>Reference ranges and flags shown here are synthetic examples.</Disclaimer></div>
    </>
  );
}
