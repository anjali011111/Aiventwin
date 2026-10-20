import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Bot, Languages, Check, X } from 'lucide-react';
import { PageHeader, Card, Button, Disclaimer, Badge } from '../../components/ui';
import { languages } from '../../data/mock';

const suggestions = ['What can I do for fever?', 'Find a nearby hospital', 'Summarize my last visit', 'Explain my lab report'];

/** Canned responses: NO language model is connected. Replace with POST /api/v1/assistant/query (RAG + citations). */
function reply(q) {
  const s = q.toLowerCase();
  if (s.includes('summar')) return { text: 'Your last visit on 10 Aug 2026 was a routine checkup. The lipid profile showed LDL 110 mg/dL and a prescription was recorded. Your clinician will interpret what this means for you.', cites: ['Visit summary (synthetic record)'] };
  if (s.includes('lab') || s.includes('report')) return { text: 'Your lipid profile is flagged “High” in this demo record, while your CBC is flagged normal. I can explain terms, but please review the results with your clinician.', cites: ['Lipid Profile 12 Aug 2026 (synthetic)', 'E-01 placeholder source'] };
  if (s.includes('fever')) return { text: 'I can’t give medical advice in this prototype. In general, a high or persistent fever, or any severe symptom, should be assessed by a clinician or emergency service.', cites: [] };
  return { text: 'I don’t have enough grounded evidence in this demo to answer that. I would rather say so than guess — try one of the suggested questions.', cites: [], abstained: true };
}

export default function Assistant() {
  const [lang, setLang] = useState('English');
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Hello Priya. I am a demo assistant with scripted answers. Ask me about your records, or tap the microphone.', cites: [] }]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [msgs]);

  const send = (text) => {
    const t = text.trim(); if (!t) return;
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    setTimeout(() => setMsgs((m) => [...m, { from: 'bot', ...reply(t) }]), 600);
    setInput('');
  };
  const startVoice = () => { setListening(true); setTranscript(''); setTimeout(() => { setListening(false); setTranscript(suggestions[2]); }, 2200); };

  return (
    <>
      <PageHeader title="AI health assistant" subtitle="Scripted demo. Voice shows a transcript preview and needs your confirmation before anything is sent or saved." />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="flex h-[620px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="flex items-center gap-2 font-semibold text-navy"><Bot size={18} className="text-bluex" aria-hidden />Assistant <Badge tone="info">No model connected</Badge></span>
            <label className="flex items-center gap-1.5 text-sm text-subtle"><Languages size={16} aria-hidden /><span className="sr-only">Language</span>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg border border-line bg-white px-2 py-1 text-sm">{languages.map((l) => <option key={l}>{l}</option>)}</select></label>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 scroll-thin" role="log" aria-live="polite" aria-label="Conversation">
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.from === 'me' ? 'bg-navy text-white' : 'bg-mist text-ink'}`}>
                  {m.text}
                  {m.from === 'bot' && m.cites?.length > 0 && <p className="mt-2 border-t border-line pt-1.5 text-xs text-subtle">Sources: {m.cites.join(' · ')}</p>}
                  {m.abstained && <p className="mt-1 text-xs font-medium text-amber-700">Abstained — insufficient evidence</p>}
                </div>
              </motion.div>))}
            <div ref={end} />
          </div>
          {transcript && (
            <div className="mx-4 mb-2 rounded-xl border border-bluex/30 bg-bluex/5 p-3 text-sm" role="group" aria-label="Voice transcript preview">
              <p className="text-xs font-semibold text-bluex">Transcript preview ({lang})</p><p className="mt-1">“{transcript}”</p>
              <div className="mt-2 flex gap-2"><Button size="sm" variant="blue" onClick={() => { send(transcript); setTranscript(''); }}><Check size={14} aria-hidden /> Confirm &amp; send</Button><Button size="sm" variant="outline" onClick={() => setTranscript('')}><X size={14} aria-hidden /> Discard</Button></div>
            </div>)}
          <form className="flex gap-2 border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input aria-label="Message" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your records…" className="flex-1 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm" />
            <Button type="submit" variant="primary" aria-label="Send message"><Send size={16} /></Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="p-6 text-center">
            <motion.div animate={listening ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ repeat: Infinity, duration: 1.3 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand" aria-hidden><Bot size={44} className="text-white" /></motion.div>
            <p className="mt-3 text-sm text-subtle" role="status">{listening ? 'Listening…' : 'Tap to speak (simulated)'}</p>
            <div className="mx-auto mt-3 flex h-10 items-end justify-center gap-1" aria-hidden>
              {Array.from({ length: 22 }).map((_, i) => <motion.span key={i} className="w-1 rounded-full bg-cyanx" animate={{ height: listening ? [6, 8 + ((i * 7) % 28), 6] : 6 }} transition={{ repeat: Infinity, duration: 0.8 + (i % 5) * 0.12 }} />)}
            </div>
            <Button className="mt-4" variant="cyan" onClick={startVoice} disabled={listening}><Mic size={16} aria-hidden /> {listening ? 'Listening' : 'Start voice'}</Button>
          </Card>
          <Card className="p-5"><h2 className="text-sm font-semibold text-navy">You can say</h2>
            <ul className="mt-2 divide-y divide-line">{suggestions.map((s) => <li key={s}><button onClick={() => send(s)} className="w-full rounded-lg px-2 py-2 text-left text-sm text-navy hover:bg-tint">“{s}”</button></li>)}</ul></Card>
          <Disclaimer>Not a medical service. In an emergency contact your local emergency number.</Disclaimer>
        </div>
      </div>
    </>
  );
}
