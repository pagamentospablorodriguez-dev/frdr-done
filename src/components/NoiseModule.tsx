import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ExternalLink, Info, Timer, RefreshCw } from 'lucide-react';

interface NoiseProps {
  active: boolean;
  onToggle: (v: boolean) => void;
}

type TrackId = 'traffic' | 'hospital' | 'airport' | 'office' | 'cafe' | 'rain';

interface Track {
  id: TrackId;
  label: string;
  emoji: string;
  description: string;
  useCase: string;
  tags: string[];
  youtubeId: string;
}

const TRACKS: Track[] = [
  {
    id: 'traffic',
    label: 'Trânsito Pesado',
    emoji: '🚗',
    description: 'Buzinas, freios, motores — o caos do rush hour',
    useCase: '"Estou preso no trânsito, chego em 30min"',
    tags: ['trânsito', 'atraso', 'urgência'],
    youtubeId: 'DJuqnPbxMaE',
  },
  {
    id: 'hospital',
    label: 'Sala de Espera — Hospital',
    emoji: '🏥',
    description: 'Passos, chamadas de PA, vozes ao fundo',
    useCase: '"Tive que levar alguém ao pronto-socorro"',
    tags: ['hospital', 'emergência', 'família'],
    youtubeId: '2OzlksZBTiA',
  },
  {
    id: 'airport',
    label: 'Aeroporto',
    emoji: '✈️',
    description: 'Anúncios de voo, multidão, turbinas ao fundo',
    useCase: '"Estou no aeroporto — viagem de negócios"',
    tags: ['viagem', 'negócios', 'clássico'],
    youtubeId: 'kgzLMR-NLLY',
  },
  {
    id: 'office',
    label: 'Escritório Movimentado',
    emoji: '🏢',
    description: 'Teclados, conversas ao fundo, telefones',
    useCase: '"Estou num cliente, muito movimento aqui"',
    tags: ['cliente', 'meeting', 'trabalho'],
    youtubeId: 'r7i6mfTbMbw',
  },
  {
    id: 'cafe',
    label: 'Café / Coworking',
    emoji: '☕',
    description: 'Máquina de café, conversas suaves',
    useCase: '"Estou num café trabalhando, sinal ruim"',
    tags: ['casual', 'remoto', 'coworking'],
    youtubeId: 'inpok4MKVLM',
  },
  {
    id: 'rain',
    label: 'Chuva / Tempestade',
    emoji: '🌧️',
    description: 'Chuva intensa batendo na janela, trovões',
    useCase: '"Tempestade aqui, minha internet caiu"',
    tags: ['clima', 'desculpa técnica', 'relaxar'],
    youtubeId: 'mPZkdNFkNps',
  },
];

function buildEmbedUrl(youtubeId: string, autoplay: boolean): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    loop: '1',
    playlist: youtubeId,
    controls: '1',
    modestbranding: '1',
    rel: '0',
  });
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

export default function NoiseModule({ active, onToggle }: NoiseProps) {
  const [selected, setSelected] = useState<TrackId>('traffic');
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerMin, setTimerMin] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  const elapsedRef = useRef<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const track = TRACKS.find(t => t.id === selected)!;

  useEffect(() => {
    if (active) {
      setIframeKey(k => k + 1);
      elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      if (timerMin > 0) {
        timerRef.current = setTimeout(() => onToggle(false), timerMin * 60 * 1000);
      }
    } else {
      clearInterval(elapsedRef.current);
      clearTimeout(timerRef.current);
      setElapsed(0);
    }
    return () => {
      clearInterval(elapsedRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (active) setIframeKey(k => k + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const formatElapsed = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-ghost-green/10 text-ghost-green">
            <Volume2 size={20} />
          </div>
          <div>
            <h2 className="font-mono font-bold text-ghost-text text-xl">Gerador de Ruído de Fundo</h2>
            <p className="text-ghost-muted text-xs font-mono">Módulo 02 · sons reais · loop infinito</p>
          </div>
        </div>
      </div>

      {/* Track grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`p-4 rounded-xl border text-left transition-all duration-150 ${
              selected === t.id
                ? 'border-ghost-green/40 bg-ghost-green/5 shadow-green-sm'
                : 'border-ghost-border bg-ghost-card hover:border-ghost-green/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{t.emoji}</span>
              {active && selected === t.id && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-ghost-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-ghost-green animate-pulse-green" />
                  AO VIVO
                </span>
              )}
            </div>
            <p className={`text-sm font-mono font-semibold mb-1 ${selected === t.id ? 'text-ghost-green' : 'text-ghost-text'}`}>
              {t.label}
            </p>
            <p className="text-[11px] text-ghost-muted leading-relaxed mb-2">{t.description}</p>
            <p className="text-[10px] text-ghost-dim font-mono italic line-clamp-1">{t.useCase}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono text-ghost-dim bg-ghost-surface border border-ghost-border px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Player */}
      <div className="mb-5 rounded-xl border border-ghost-border bg-ghost-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ghost-border">
          <div className="flex items-center gap-3">
            <span className="text-lg">{track.emoji}</span>
            <div>
              <p className="text-sm font-mono font-semibold text-ghost-text">{track.label}</p>
              <p className="text-[10px] font-mono text-ghost-muted">
                {active ? `tocando em loop · ${formatElapsed(elapsed)}` : 'clique em Tocar abaixo'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {active && (
              <div className="flex gap-0.5 items-end h-5">
                {[3, 5, 7, 5, 8, 6, 4, 7, 5, 3, 6, 8].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-ghost-green rounded-sm"
                    style={{
                      height: `${h * 3}px`,
                      animation: `pulseGreen ${0.35 + (i % 4) * 0.12}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.06}s`,
                    }}
                  />
                ))}
              </div>
            )}
            <a
              href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-ghost-muted hover:text-ghost-text hover:bg-ghost-card transition-all"
              title="Abrir no YouTube"
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={() => setIframeKey(k => k + 1)}
              className="p-1.5 rounded-lg text-ghost-muted hover:text-ghost-text hover:bg-ghost-card transition-all"
              title="Recarregar player"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* YouTube iframe */}
        <div className="relative" style={{ paddingBottom: '28%' }}>
          <iframe
            key={iframeKey}
            src={buildEmbedUrl(track.youtubeId, active)}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={track.label}
          />
          {!active && (
            <div className="absolute inset-0 bg-ghost-bg/85 flex items-center justify-center pointer-events-none">
              <p className="text-xs font-mono text-ghost-muted">Clique em Tocar para iniciar</p>
            </div>
          )}
        </div>

        {/* Volume + timer */}
        <div className="p-4 border-t border-ghost-border space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMuted(v => !v)}
              className="text-ghost-muted hover:text-ghost-text transition-colors flex-shrink-0"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range" min={0} max={100} value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs font-mono text-ghost-muted w-8 text-right">{muted ? '0' : volume}%</span>
          </div>
          <div className="flex items-center gap-3">
            <Timer size={13} className="text-ghost-muted flex-shrink-0" />
            <span className="text-xs font-mono text-ghost-muted">Auto-parar em</span>
            <input
              type="number" min={0} max={480} value={timerMin}
              onChange={e => setTimerMin(Number(e.target.value))}
              className="w-16 text-xs py-0.5 px-2"
            />
            <span className="text-[11px] font-mono text-ghost-dim">min (0 = infinito)</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mb-5 p-4 rounded-xl bg-ghost-card border border-ghost-border flex items-start gap-3">
        <Info size={13} className="text-ghost-muted mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-ghost-muted font-mono leading-relaxed space-y-1">
          <p>Sons reais carregados direto do YouTube em loop. Minimize a janela e o áudio continua.</p>
          <p>Se o player mostrar erro, clique no <RefreshCw size={10} className="inline" /> para recarregar ou abra direto no YouTube.</p>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => onToggle(!active)}
        className={`w-full py-4 rounded-xl font-mono font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 ${
          active
            ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
            : 'bg-ghost-green text-ghost-bg hover:bg-ghost-green-dim shadow-green-md'
        }`}
      >
        <Volume2 size={18} />
        {active ? `Parar — ${track.label}` : `Tocar — ${track.label}`}
      </button>

      {active && (
        <div className="mt-4 p-3 rounded-xl bg-ghost-green/5 border border-ghost-green/20 text-center">
          <p className="text-xs font-mono text-ghost-green">{track.useCase}</p>
        </div>
      )}
    </div>
  );
}
