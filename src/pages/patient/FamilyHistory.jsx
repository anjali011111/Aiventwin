import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Move, Sparkles } from 'lucide-react';
import { PageHeader, Card, Badge, Button, Disclaimer } from '../../components/ui';
import { familyNodes, familyEdges, inheritedRisks } from '../../data/mock';

const initial = Object.fromEntries(familyNodes.map((n) => [n.id, { x: n.x, y: n.y }]));
const W = 24;   // node width, % of canvas
const H = 21;   // approximate node height, % of canvas

/**
 * Family tree whose nodes can be dragged; the connecting curves follow in real time.
 * Click a risk on the right to light up the relatives who carry that condition.
 * Fully synthetic. Family history raises estimated risk — it is not a diagnosis.
 */
export default function FamilyHistory() {
  const box = useRef(null);
  const [pos, setPos] = useState(initial);
  const [active, setActive] = useState(null);
  const [sel, setSel] = useState('you');
  const [hl, setHl] = useState(null);
  const drag = useRef(null);

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const onDown = (e, id) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = id; setActive(id); setSel(id); };
  const onMove = (e) => {
    if (!drag.current) return;
    const r = box.current.getBoundingClientRect();
    setPos((p) => ({ ...p, [drag.current]: { x: clamp(((e.clientX - r.left) / r.width) * 100 - W / 2, 0, 100 - W), y: clamp(((e.clientY - r.top) / r.height) * 100 - H / 2, 0, 100 - H) } }));
  };
  const onUp = () => { drag.current = null; setActive(null); };
  const onKey = (e, id) => {
    const d = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] }[e.key];
    if (!d) return;
    e.preventDefault();
    setPos((p) => ({ ...p, [id]: { x: clamp(p[id].x + d[0], 0, 100 - W), y: clamp(p[id].y + d[1], 0, 100 - H) } }));
  };

  const edgePath = ([a, b, kind]) => {
    const A = pos[a]; const B = pos[b];
    if (kind === 'partner') {
      const left = A.x <= B.x ? A : B; const right = A.x <= B.x ? B : A;
      return `M${left.x + W} ${left.y + H / 2} L${right.x} ${right.y + H / 2}`;
    }
    const x1 = A.x + W / 2; const y1 = A.y + H; const x2 = B.x + W / 2; const y2 = B.y; const my = (y1 + y2) / 2;
    return `M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  };

  const node = familyNodes.find((n) => n.id === sel);
  const carriers = hl ? familyNodes.filter((n) => n.tag === hl).map((n) => n.name) : [];

  return (
    <>
      <PageHeader title="Family & genetic insights" subtitle="Drag relatives to rearrange the tree. Select a risk to see who in the family it comes from."
        actions={<Button variant="outline" onClick={() => { setPos(initial); setHl(null); }}><RotateCcw size={15} aria-hidden /> Reset tree</Button>} />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div ref={box} className="relative h-[520px] touch-none select-none bg-white" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {familyEdges.map((e) => {
                const on = e[0] === sel || e[1] === sel;
                return <path key={e[0] + e[1]} d={edgePath(e)} fill="none" stroke={on ? '#5170FD' : '#9fb3c8'} strokeWidth={on ? 2.2 : 1.6} vectorEffect="non-scaling-stroke" strokeDasharray={e[2] === 'partner' ? undefined : '5 5'} />;
              })}
            </svg>
            {familyNodes.map((n) => {
              const lit = hl && n.tag === hl;
              const dim = hl && n.tag !== hl && n.id !== 'you';
              return (
                <motion.div key={n.id} role="button" tabIndex={0} aria-label={`${n.name}: ${n.cond}. Drag or use arrow keys to move.`} aria-pressed={sel === n.id}
                  animate={{ opacity: dim ? 0.45 : 1, scale: lit ? 1.05 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  onPointerDown={(e) => onDown(e, n.id)} onKeyDown={(e) => onKey(e, n.id)} onFocus={() => setSel(n.id)}
                  style={{ left: `${pos[n.id].x}%`, top: `${pos[n.id].y}%` }}
                  className={`absolute w-[24%] min-w-[104px] cursor-grab rounded-2xl border bg-white p-2.5 text-center shadow-card active:cursor-grabbing ${lit ? 'z-10 border-risk ring-4 ring-risk/20' : active === n.id ? 'z-20 border-cyanx shadow-lift' : sel === n.id ? 'border-bluex' : 'border-line'}`}>
                  <span className={`mx-auto grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white ${n.id === 'you' ? 'bg-cyanx !text-ink' : 'bg-navy'}`} aria-hidden>{n.name[0]}</span>
                  <p className="mt-1 text-sm font-semibold text-navy">{n.name}</p><p className={`text-[11px] ${n.id === 'you' ? 'text-subtle' : 'text-risk'}`}>{n.cond}</p>
                </motion.div>
              );
            })}
            <p className="absolute bottom-2 right-3 flex items-center gap-1 text-[11px] text-subtle"><Move size={12} aria-hidden /> Synthetic family</p>
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5" aria-live="polite"><h2 className="font-semibold text-navy">{node.name}</h2><p className="mt-1 text-sm text-subtle">Recorded: {node.cond}</p></Card>
          <Card className="p-5"><h2 className="font-semibold text-navy">Potential inherited risks</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-subtle"><Sparkles size={12} aria-hidden /> Select a risk to highlight relatives.</p>
            <ul className="mt-3 divide-y divide-line">{inheritedRisks.map((r) => (
              <li key={r.id}>
                <button onClick={() => setHl(hl === r.tag ? null : r.tag)} aria-pressed={hl === r.tag}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-sm transition-colors hover:bg-mist ${hl === r.tag ? 'bg-risk/5 font-semibold' : ''}`}>
                  <span>{r.name}</span><Badge tone={r.level === 'Low' ? 'ok' : 'warn'}>{r.level}</Badge>
                </button>
              </li>))}</ul>
            <p className="mt-2 min-h-[1.25rem] text-xs text-subtle" aria-live="polite">{hl ? (carriers.length ? `Recorded in: ${carriers.join(', ')}.` : 'No relative recorded.') : ''}</p>
          </Card>
          <Disclaimer>Family history raises estimated risk; it is not a diagnosis. Genetic testing and counselling are outside this prototype.</Disclaimer>
        </div>
      </div>
    </>
  );
}
