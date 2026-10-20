import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Pencil, X, ShieldAlert } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Modal, ListSkeleton, ErrorState, Disclaimer } from '../../components/ui';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { useTwin } from '../../app/TwinProvider';

const decisions = { accept: ['Accepted', 'ok'], modify: ['Modified', 'info'], reject: ['Rejected', 'risk'] };

export default function PredictionReview() {
  const { loading, error, data, reload } = useApi(api.getPredictionQueue, []);
  const { logEvent, events } = useTwin();
  const [status, setStatus] = useState({});
  const [dlg, setDlg] = useState(null); // { pred, decision }
  const [note, setNote] = useState('');

  const submit = () => {
    setStatus((s) => ({ ...s, [dlg.pred.id]: { decision: dlg.decision, note } }));
    logEvent({ action: `prediction.review.${dlg.decision}`, detail: `${dlg.pred.id} · ${dlg.pred.patient}${note ? ` · “${note}”` : ''}` });
    setDlg(null); setNote('');
  };

  return (
    <>
      <PageHeader title="Prediction review" subtitle="Every prediction links to the Twin snapshot, model version and evidence it used. Your decision is written to the audit log." />
      <div className="mb-5"><Disclaimer>The values below are illustrative placeholders with no trained model behind them. In production, a prediction is shown only when the patient is eligible, the data is fresh, and a safety gate passes.</Disclaimer></div>
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {loading ? <ListSkeleton rows={3} /> : error ? <ErrorState message={error} onRetry={reload} /> : data.map((p) => {
            const st = status[p.id];
            return (
              <Card key={p.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold text-navy">{p.target}</h2><p className="text-sm text-subtle"><Link to={`/doctor/patients/${p.pid}`} className="font-medium text-bluex">{p.patient}</Link> · horizon {p.horizon}</p></div>{st ? <Badge tone={decisions[st.decision][1]}>{decisions[st.decision][0]}</Badge> : <Badge tone="warn">Awaiting review</Badge>}</div>
                <div className="mt-4 grid items-center gap-4 sm:grid-cols-[120px_1fr]">
                  <div><p className="text-3xl font-semibold tabular-nums text-navy">{Math.round(p.prob * 100)}%</p><p className="text-xs text-subtle">95% interval {Math.round(p.lo * 100)}–{Math.round(p.hi * 100)}%</p></div>
                  <div className="relative h-3 rounded-full bg-slate-100" role="img" aria-label={`Estimate ${Math.round(p.prob * 100)} percent, interval ${Math.round(p.lo * 100)} to ${Math.round(p.hi * 100)} percent`}>
                    <div className="absolute h-full rounded-full bg-bluex/30" style={{ left: `${p.lo * 100}%`, width: `${(p.hi - p.lo) * 100}%` }} />
                    <div className="absolute -top-1 h-5 w-1.5 rounded bg-navy" style={{ left: `${p.prob * 100}%` }} />
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs"><div><dt className="text-subtle">Snapshot</dt><dd className="font-medium text-navy">{p.snapshot}</dd></div><div><dt className="text-subtle">Model</dt><dd className="font-medium text-navy">{p.model}</dd></div><div><dt className="text-subtle">Evidence</dt><dd className="font-medium text-navy"><Link to="/doctor/evidence" className="text-bluex">{p.evidence.join(', ')}</Link></dd></div></dl>
                {!st && <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="success" onClick={() => setDlg({ pred: p, decision: 'accept' })}><Check size={15} aria-hidden /> Accept</Button><Button size="sm" variant="outline" onClick={() => setDlg({ pred: p, decision: 'modify' })}><Pencil size={15} aria-hidden /> Modify</Button><Button size="sm" variant="outline" onClick={() => setDlg({ pred: p, decision: 'reject' })}><X size={15} aria-hidden /> Reject</Button></div>}
                {st?.note && <p className="mt-3 text-sm text-subtle">Note: {st.note}</p>}
              </Card>);
          })}
        </div>
        <Card className="h-fit p-5"><h2 className="flex items-center gap-2 font-semibold text-navy"><ShieldAlert size={18} className="text-bluex" aria-hidden />Audit trail (this session)</h2>
          {events.length === 0 ? <p className="mt-3 text-sm text-subtle">No events yet.</p> : <ul className="mt-3 space-y-2 text-sm">{events.map((e, i) => <li key={i} className="rounded-xl bg-mist p-2.5"><p className="font-medium text-navy">{e.action}</p><p className="text-xs text-subtle">{e.detail} · {e.at.slice(11, 19)} UTC</p></li>)}</ul>}</Card>
      </div>

      <Modal open={!!dlg} onClose={() => setDlg(null)} title={dlg ? `${decisions[dlg.decision][0].replace('ed', 'e').replace('Modifi', 'Modify')} prediction ${dlg.pred.id}` : ''}>
        <label htmlFor="note" className="mb-1 block text-sm font-medium text-navy">Clinical note {dlg?.decision === 'accept' ? '(optional)' : '(recommended)'}</label>
        <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-line p-3 text-sm" placeholder="Reason for your decision" />
        <p className="mt-2 text-xs text-subtle">Recorded as an audit event with your identity and time. Avoid entering real patient details in this demo.</p>
        <div className="mt-4 flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setDlg(null)}>Cancel</Button><Button className="flex-1" onClick={submit}>Submit decision</Button></div>
      </Modal>
    </>
  );
}
