import { useEffect, useState } from 'react';
import { Search, BookOpen, AlertTriangle, ExternalLink } from 'lucide-react';
import { PageHeader, Card, Badge, Button, ListSkeleton, Disclaimer } from '../../components/ui';
import { api } from '../../services/api';

export default function Evidence() {
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: true, results: [], abstained: false });
  const [open, setOpen] = useState(null);

  const run = (query) => { setState((s) => ({ ...s, loading: true })); api.searchEvidence(query).then((r) => setState({ loading: false, ...r })); };
  useEffect(() => { run(''); }, []);

  return (
    <>
      <PageHeader title="Evidence & citations" subtitle="Retrieved source passages behind explanations. When nothing relevant is found, the system abstains rather than guess." />
      <div className="mb-5"><Disclaimer>Every source below is a clearly marked PLACEHOLDER. Before real use, replace them with verified, licensed guidelines and record each document’s publisher, version, date and licence. Retrieval supports explanation; it does not validate the risk model.</Disclaimer></div>
      <form className="mb-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); run(q); }} role="search">
        <div className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden /><input aria-label="Search evidence" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: cholesterol, blood pressure, family history, sleep" className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm" /></div>
        <Button type="submit" variant="primary">Retrieve</Button>
      </form>
      <div aria-live="polite">
        {state.loading ? <ListSkeleton rows={3} /> : state.abstained ? (
          <Card className="border-amber-200 bg-amber-50 p-6"><p className="flex items-center gap-2 font-semibold text-amber-900"><AlertTriangle size={18} aria-hidden /> Abstained — no relevant evidence retrieved</p><p className="mt-1 text-sm text-amber-900/80">No passage in the curated sources matched “{q}”. In production this escalates to the clinician instead of producing an unsupported answer.</p></Card>
        ) : (
          <div className="space-y-4">{state.results.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bluex/10 text-bluex"><BookOpen size={19} aria-hidden /></span><div><h2 className="font-semibold text-navy"><span className="mr-2 text-xs font-medium text-subtle">{d.id}</span>{d.title}</h2><p className="text-xs text-subtle">{d.publisher} · {d.version} · {d.date} · licence: {d.license}</p></div></div><Badge tone="info">relevance {d.relevance.toFixed(2)}</Badge></div>
              <blockquote className="mt-3 border-l-2 border-brand-3 pl-3 text-sm text-ink"><p className="mb-1 text-xs font-semibold text-subtle">{d.section} · exact retrieved passage</p>{d.passage}</blockquote>
              <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-bluex" onClick={() => setOpen(open === d.id ? null : d.id)} aria-expanded={open === d.id}>{open === d.id ? 'Hide' : 'Show'} source metadata <ExternalLink size={13} aria-hidden /></button>
              {open === d.id && <dl className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3 text-xs"><div><dt className="text-subtle">Tags</dt><dd>{d.tags.join(', ')}</dd></div><div><dt className="text-subtle">Source URL</dt><dd>not set (placeholder)</dd></div></dl>}
            </Card>))}</div>)}
      </div>
    </>
  );
}
