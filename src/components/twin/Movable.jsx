import { useRef, useState } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

/**
 * FreePanel — a panel you can drag anywhere inside a constraint container.
 * Position persists in localStorage. Keyboard: focus the grip, use arrow keys (Shift = bigger step).
 */
export function FreePanel({ id, storageKey, constraintsRef, initial, className = '', title, children, width = 'w-[10.5rem]', fling = false }) {
  const key = `${storageKey}.${id}`;
  const saved = (() => { try { return JSON.parse(localStorage.getItem(key)) ?? { x: 0, y: 0 }; } catch { return { x: 0, y: 0 }; } })();
  const x = useMotionValue(saved.x);
  const y = useMotionValue(saved.y);
  const controls = useDragControls();
  const persist = () => { try { localStorage.setItem(key, JSON.stringify({ x: x.get(), y: y.get() })); } catch { /* ignore */ } };

  const onKey = (e) => {
    const step = e.shiftKey ? 40 : 12;
    const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (!map[e.key]) return;
    e.preventDefault();
    x.set(x.get() + map[e.key][0]); y.set(y.get() + map[e.key][1]); persist();
  };

  return (
    <motion.div
      drag dragControls={controls} dragListener={false} dragMomentum={fling} dragElastic={fling ? 0.2 : 0.04} dragConstraints={constraintsRef}
      dragTransition={fling ? { bounceStiffness: 260, bounceDamping: 18, power: 0.35, timeConstant: 260 } : undefined}
      style={{ x, y, ...initial }} onDragEnd={persist} onDragTransitionEnd={persist} whileDrag={{ zIndex: 40, backgroundColor: '#FFFFFF', boxShadow: '0 12px 28px -12px rgba(20,33,61,.28)' }}
      className={`group absolute ${width} rounded-lg p-2 text-ink transition-colors hover:bg-white/90 hover:ring-1 hover:ring-line focus-within:bg-white/90 focus-within:ring-1 focus-within:ring-line ${className}`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-subtle">{title}</span>
        <button
          onPointerDown={(e) => controls.start(e)} onKeyDown={onKey}
          aria-label={`Move ${title} panel. Drag, or use arrow keys.`}
          className="cursor-grab touch-none rounded p-0.5 text-muted opacity-0 transition-opacity hover:text-navy focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 active:cursor-grabbing"
        ><GripVertical size={14} aria-hidden /></button>
      </div>
      {children}
    </motion.div>
  );
}

/**
 * MovableGrid — dashboard widgets you can rearrange by dragging the grip onto another widget.
 * Order persists. Keyboard: focus the grip and press ← / → (or ↑ / ↓) to move earlier/later.
 * items: [{ id, span?: 'md:col-span-2', node }]
 */
export function MovableGrid({ items, storageKey, cols = 'md:grid-cols-2 xl:grid-cols-3' }) {
  const ids = items.map((i) => i.id);
  const [order, setOrder] = useLocalStorage(storageKey, ids);
  const clean = [...order.filter((i) => ids.includes(i)), ...ids.filter((i) => !order.includes(i))];
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const [dragging, setDragging] = useState(null);

  const move = (id, to) => {
    const next = clean.filter((i) => i !== id);
    next.splice(Math.max(0, Math.min(next.length, to)), 0, id);
    setOrder(next);
  };
  const swapOnDrop = (id, e, info) => {
    const px = e.clientX ?? info.point.x - window.scrollX;
    const py = e.clientY ?? info.point.y - window.scrollY;
    const hit = document.elementsFromPoint(px, py).map((el) => el.closest?.('[data-grid-id]')).find((el) => el && el.dataset.gridId !== id);
    if (hit) move(id, clean.indexOf(hit.dataset.gridId));
    setDragging(null);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-subtle">Tip: drag the <GripVertical size={12} className="inline" aria-hidden /> handle to rearrange widgets (or focus it and use arrow keys). Your layout is remembered.
        {' '}<button className="font-medium text-brand-4 underline" onClick={() => setOrder(ids)}>Reset layout</button></p>
      <div className={`grid grid-cols-[minmax(0,1fr)] items-start gap-5 ${cols}`}>
        {clean.map((id, idx) => (
          <Cell key={id} id={id} idx={idx} span={byId[id].span} dragging={dragging === id}
            onStart={() => setDragging(id)} onDrop={swapOnDrop} onMove={(d) => move(id, idx + d)}>
            {byId[id].node}
          </Cell>
        ))}
      </div>
    </div>
  );
}

function Cell({ id, span = '', dragging, onStart, onDrop, onMove, children }) {
  const controls = useDragControls();
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref} layout data-grid-id={id} drag dragControls={controls} dragListener={false} dragSnapToOrigin dragMomentum={false}
      onDragStart={onStart} onDragEnd={(e, info) => onDrop(id, e, info)}
      whileDrag={{ zIndex: 50, boxShadow: '0 16px 36px -14px rgba(20,33,61,.3)' }}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      className={`relative ${span} ${dragging ? 'cursor-grabbing' : ''}`}
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => {
          if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); onMove(-1); }
          if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); onMove(1); }
        }}
        aria-label="Move widget. Drag, or use arrow keys."
        className="absolute right-3 top-3 z-10 cursor-grab touch-none rounded-lg p-1 text-muted hover:bg-tint hover:text-navy active:cursor-grabbing"
      ><GripVertical size={16} aria-hidden /></button>
      {children}
    </motion.div>
  );
}
