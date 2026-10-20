import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { motion } from 'framer-motion';

const axis = { fontSize: 12, fill: '#566579' };
const tip = { borderRadius: 12, border: '1px solid #DCE7F5', fontSize: 12, boxShadow: '0 8px 24px -12px rgba(20,36,58,.25)' };

/** Accessible line chart: figure label + hidden data summary for screen readers. */
export function TrendChart({ data, xKey = 'm', lines, height = 220, label }) {
  const summary = lines.map((l) => `${l.name}: ${data.map((d) => `${d[xKey]} ${d[l.key]}`).join(', ')}`).join('. ');
  return (
    <figure aria-label={label}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
            <CartesianGrid stroke="#DCE7F5" vertical={false} />
            <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={false} />
            <YAxis tick={axis} tickLine={false} axisLine={false} domain={['dataMin - 8', 'dataMax + 8']} />
            <Tooltip contentStyle={tip} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            {lines.map((l) => <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.4} dot={{ r: 3.5 }} activeDot={{ r: 5 }} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}

export function Sparkline({ values, color = '#60ABFB', height = 44, label }) {
  const data = values.map((v, i) => ({ i, v }));
  return (
    <div style={{ height }} role="img" aria-label={label ?? `Trend: ${values.join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Area dataKey="v" type="monotone" stroke={color} strokeWidth={2} fillOpacity={0.12} fill={color} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleBars({ data, xKey, yKey, height = 220, colors, label }) {
  return (
    <figure aria-label={label}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#DCE7F5" vertical={false} />
            <XAxis dataKey={xKey} tick={axis} tickLine={false} axisLine={false} />
            <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(79,125,243,.06)' }} />
            <Bar dataKey={yKey} radius={[8, 8, 0, 0]}>{data.map((d, i) => <Cell key={i} fill={colors?.[i] ?? '#5170FD'} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">{data.map((d) => `${d[xKey]}: ${d[yKey]}`).join(', ')}</figcaption>
    </figure>
  );
}

const levelColor = { Low: '#1F9D6B', Moderate: '#D9822B', High: '#D64545' };
export function RiskBar({ label, value, level }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-navy">{label}</span>
        <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: `${levelColor[level]}1A`, color: levelColor[level] }}>{level}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-10 text-lg font-semibold tabular-nums">{value}%</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${value}%`}>
          <motion.div className="h-full rounded-full" style={{ background: levelColor[level] }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        </div>
      </div>
    </div>
  );
}
