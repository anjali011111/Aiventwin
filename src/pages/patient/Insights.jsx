import { useState } from 'react';
import { Dumbbell, Apple, Moon, CalendarCheck, Info } from 'lucide-react';
import { PageHeader, Card, Tabs, Disclaimer, Badge } from '../../components/ui';
import { RiskBar, SimpleBars } from '../../components/charts/Charts';
import { useTwin } from '../../app/TwinProvider';
import { risks, featureContrib, recommendations, inheritedRisks } from '../../data/mock';

const recIcon = { run: Dumbbell, food: Apple, sleep: Moon, check: CalendarCheck };
const tabs = [{ id: 'current', label: 'Current Health' }, { id: 'risk', label: 'Risk Analysis' }, { id: 'family', label: 'Family History' }];

export default function Insights() {
  const { latest } = useTwin();
  const [tab, setTab] = useState('current');
  return (
    <>
      <PageHeader title="Health insights" subtitle="Risk estimates and the factors behind them. Illustrative only — there is no validated model behind these numbers yet." />
      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          {tab === 'current' && (
            <Card className="p-5"><h2 className="font-semibold text-navy">Risk prediction</h2>
              <p className="mt-1 text-xs text-subtle">Computed from Twin snapshot v{latest.version} · model: none (demo placeholder)</p>
              <div className="mt-5 space-y-5">{risks.map((r) => <RiskBar key={r.id} {...r} />)}</div></Card>)}
          {tab === 'risk' && (
            <Card className="p-5"><h2 className="font-semibold text-navy">What influences the estimate?</h2>
              <p className="mt-1 flex items-start gap-1.5 text-xs text-subtle"><Info size={13} className="mt-0.5 shrink-0" aria-hidden />Bars show illustrative contributions in percentage points (positive raises, negative lowers). Replace with SHAP or similar from a trained, validated model.</p>
              <div className="mt-4"><SimpleBars label="Illustrative feature contributions to risk" data={featureContrib} xKey="f" yKey="v" height={280} colors={featureContrib.map((d) => (d.v > 0 ? '#D9822B' : '#1F9D6B'))} /></div></Card>)}
          {tab === 'family' && (
            <Card className="p-5"><h2 className="font-semibold text-navy">Potential inherited risks</h2>
              <ul className="mt-4 divide-y divide-line">{inheritedRisks.map((r) => <li key={r.id} className="flex items-center justify-between py-3 text-sm"><span className="font-medium text-navy">{r.name}</span><Badge tone={r.level === 'Low' ? 'ok' : 'warn'}>{r.level} risk</Badge></li>)}</ul>
              <p className="mt-3 text-xs text-subtle">A relative’s condition can raise estimated risk; it does not mean you have or will develop it.</p></Card>)}
        </div>
        <div className="space-y-5">
          <Card className="p-5"><h2 className="font-semibold text-navy">Personalised suggestions</h2>
            <ul className="mt-3 divide-y divide-line">{recommendations.map((r) => { const I = recIcon[r.icon]; return <li key={r.id} className="flex items-center gap-3 py-3 text-sm font-medium text-navy"><I size={18} className="text-bluex" aria-hidden />{r.text}</li>; })}</ul></Card>
          <Disclaimer>These insights are general wellness suggestions generated for a prototype. They are not medical advice. Discuss any concerns with your clinician.</Disclaimer>
        </div>
      </div>
    </>
  );
}
