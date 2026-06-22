import { useState } from 'react';
import {
  MessageSquare, Send, Copy, RotateCcw, ChevronDown, Sparkles, AlertCircle, CheckCircle2, Info,
} from 'lucide-react';

interface ResponderProps {
  onResponse: () => void;
}

type Tone = 'busy' | 'aligning' | 'followup' | 'escalating' | 'delegating';
type Urgency = 'low' | 'medium' | 'high';

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: 'busy', label: 'Ocupado', desc: '"Estou em cima de muito aqui, mas já retorno"' },
  { id: 'aligning', label: 'Alinhando', desc: '"Vou alinhar com o time e te trago"' },
  { id: 'followup', label: 'Follow-up', desc: '"Já está sendo endereçado, follow-up hoje"' },
  { id: 'escalating', label: 'Escalando', desc: '"Escalei pro time correto, aguarda"' },
  { id: 'delegating', label: 'Delegando', desc: '"Já redirecionei para quem pode resolver"' },
];

const TEMPLATES = [
  { label: 'Chefe pedindo update', text: 'Preciso de um update sobre o projeto. Onde estamos?' },
  { label: 'Reunião de última hora', text: 'Você pode entrar numa call agora em 10 minutos?' },
  { label: 'Cobrança de deadline', text: 'Aquele relatório que pedi para hoje já está pronto?' },
  { label: 'Pedido de explicação', text: 'Me explica o que aconteceu com aquela entrega de ontem.' },
  { label: 'Solicitação urgente', text: 'Preciso URGENTE de um número consolidado sobre as vendas do Q3.' },
  { label: 'Avaliação de desempenho', text: 'Precisamos conversar sobre sua performance essa semana.' },
];



async function callAutoResponder(
  message: string,
  tone: Tone,
  urgency: Urgency
): Promise<string> {

  const res = await fetch(
    "/.netlify/functions/auto-responder",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        tone,
        urgency,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erro ao contatar o servidor");
  }

  const data = await res.json();

  return data.response;
}





export default function ResponderModule({ onResponse }: ResponderProps) {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<Tone>('aligning');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ input: string; output: string; tone: Tone }[]>([]);

  const handleGenerate = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const result = await callAutoResponder(message.trim(), tone, urgency);
      setResponse(result);
      setHistory(h => [{ input: message.trim(), output: result, tone }, ...h.slice(0, 9)]);
      onResponse();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-ghost-green/10 text-ghost-green">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-mono font-bold text-ghost-text text-xl">Auto-Responder Corporativo Pro</h2>
            <p className="text-ghost-muted text-xs font-mono">Módulo 03 · IA GPT-4o mini · jargão ilimitado</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input side */}
        <div className="space-y-4">
          {/* Templates */}
          <div>
            <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-2">Templates rápidos</p>
            <div className="relative">
              <select
                onChange={e => e.target.value && setMessage(e.target.value)}
                className="w-full pr-8 appearance-none cursor-pointer"
              >
                <option value="">Escolher template...</option>
                {TEMPLATES.map(t => (
                  <option key={t.label} value={t.text}>{t.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ghost-muted pointer-events-none" />
            </div>
          </div>

          {/* Message input */}
          <div>
            <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-2">
              Mensagem do chefe / colega
            </p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Cole aqui o que o chefe te mandou..."
              rows={5}
              className="w-full resize-none"
            />
          </div>

          {/* Tone */}
          <div>
            <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-2">Tom da resposta</p>
            <div className="grid grid-cols-1 gap-1.5">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    tone === t.id
                      ? 'border-ghost-green/40 bg-ghost-green/5'
                      : 'border-ghost-border bg-ghost-card hover:border-ghost-green/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tone === t.id ? 'bg-ghost-green' : 'bg-ghost-dim'}`} />
                  <div>
                    <span className={`text-sm font-mono font-medium ${tone === t.id ? 'text-ghost-green' : 'text-ghost-text'}`}>
                      {t.label}
                    </span>
                    <span className="text-[11px] text-ghost-muted ml-2">{t.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div>
            <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-2">Urgência detectada</p>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Urgency[]).map(u => (
                <button
                  key={u}
                  onClick={() => setUrgency(u)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-mono font-medium transition-all ${
                    urgency === u
                      ? u === 'high'
                        ? 'border-red-500/40 bg-red-500/10 text-red-400'
                        : u === 'medium'
                        ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                        : 'border-ghost-green/40 bg-ghost-green/10 text-ghost-green'
                      : 'border-ghost-border bg-ghost-card text-ghost-muted hover:border-ghost-green/20'
                  }`}
                >
                  {u === 'low' ? 'Baixa' : u === 'medium' ? 'Média' : 'Alta'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !message.trim()}
            className="w-full py-3.5 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-3 bg-ghost-green text-ghost-bg hover:bg-ghost-green-dim shadow-green-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-ghost-bg/30 border-t-ghost-bg rounded-full animate-spin" />
                Gerando resposta...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Gerar Resposta Pro
              </>
            )}
          </button>
        </div>

        {/* Output side */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-2">Resposta gerada</p>
            <div className={`relative min-h-48 p-4 rounded-xl border bg-ghost-card transition-all ${response ? 'border-ghost-green/30' : 'border-ghost-border'}`}>
              {error && (
                <div className="flex items-start gap-2 text-red-400 text-xs font-mono">
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}
              {loading && !response && (
                <div className="flex items-center justify-center h-full min-h-36 text-ghost-muted">
                  <div className="text-center">
                    <div className="flex gap-1 justify-center mb-3">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-ghost-green animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-mono">construindo jargão corporativo...</p>
                  </div>
                </div>
              )}
              {response && (
                <p className="text-sm text-ghost-text leading-relaxed font-sans">{response}</p>
              )}
              {!response && !loading && !error && (
                <div className="flex items-center justify-center h-full min-h-36 text-ghost-dim">
                  <div className="text-center">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-mono">a resposta aparece aqui</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {response && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`flex-1 py-2.5 rounded-lg border text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
                  copied
                    ? 'border-ghost-green/40 bg-ghost-green/10 text-ghost-green'
                    : 'border-ghost-border bg-ghost-card text-ghost-muted hover:border-ghost-green/30 hover:text-ghost-text'
                }`}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg border border-ghost-border bg-ghost-card text-ghost-muted hover:border-ghost-green/30 hover:text-ghost-text text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <RotateCcw size={14} />
                Regenerar
              </button>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div>
              <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-2">Histórico recente</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setResponse(h.output)}
                    className="w-full text-left p-3 rounded-lg border border-ghost-border bg-ghost-card hover:border-ghost-green/20 transition-all"
                  >
                    <p className="text-[11px] font-mono text-ghost-muted mb-1 truncate">
                      <span className="text-ghost-dim">[{TONES.find(t => t.id === h.tone)?.label}]</span> {h.input}
                    </p>
                    <p className="text-xs text-ghost-text line-clamp-2 leading-relaxed">{h.output}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-ghost-card border border-ghost-border">
            <Info size={12} className="text-ghost-muted mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-ghost-muted font-mono leading-relaxed">
              A IA usa GPT-4o mini para gerar respostas com jargões corporativos calibrados ao tom e urgência que você selecionou.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
