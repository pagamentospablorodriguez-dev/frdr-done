import { useState, useEffect } from 'react';
import { Mouse, Volume2, MessageSquare, Activity, Clock, Shield, TrendingUp, Zap } from 'lucide-react';
import type { Module } from '../config';

interface DashboardProps {
  onNavigate: (m: Module) => void;
  jigglerActive: boolean;
  noiseActive: boolean;
  sessionMinutes: number;
  responsesCount: number;
}

const StatCard = ({
  value,
  label,
  icon: Icon,
  active,
}: {
  value: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
}) => (
  <div
    className={`p-5 rounded-xl border bg-ghost-card transition-all duration-300 ${
      active ? 'border-ghost-green/40 shadow-green-sm' : 'border-ghost-border'
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className={`p-2 rounded-lg ${
          active ? 'bg-ghost-green/10 text-ghost-green' : 'bg-ghost-surface text-ghost-muted'
        }`}
      >
        <Icon size={18} />
      </div>
      {active && (
        <span className="text-[10px] font-mono text-ghost-green bg-ghost-green/10 border border-ghost-green/20 px-2 py-0.5 rounded-full">
          ATIVO
        </span>
      )}
    </div>
    <p className="text-2xl font-mono font-bold text-ghost-text mb-1">{value}</p>
    <p className="text-xs text-ghost-muted font-mono">{label}</p>
  </div>
);

const ModuleCard = ({
  icon: Icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-5 rounded-xl border transition-all duration-200 group hover:border-ghost-green/40 hover:shadow-green-sm ${
      active
        ? 'border-ghost-green/40 bg-ghost-green/5 shadow-green-sm'
        : 'border-ghost-border bg-ghost-card'
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-xl transition-all ${
          active
            ? 'bg-ghost-green/15 text-ghost-green'
            : 'bg-ghost-surface text-ghost-muted group-hover:text-ghost-green group-hover:bg-ghost-green/10'
        }`}
      >
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono font-semibold text-ghost-text text-sm">{title}</p>
          {active && (
            <span className="w-2 h-2 rounded-full bg-ghost-green animate-pulse-green flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-ghost-muted leading-relaxed">{description}</p>
      </div>
    </div>
  </button>
);

export default function Dashboard({
  onNavigate,
  jigglerActive,
  noiseActive,
  sessionMinutes,
  responsesCount,
}: DashboardProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const anyActive = jigglerActive || noiseActive;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-ghost-muted bg-ghost-card border border-ghost-border px-2 py-1 rounded">
              {time.toLocaleTimeString('pt-BR')}
            </span>
            <span
              className={`text-xs font-mono px-2 py-1 rounded border ${
                anyActive
                  ? 'text-ghost-green bg-ghost-green/10 border-ghost-green/30'
                  : 'text-ghost-muted border-ghost-border bg-ghost-card'
              }`}
            >
              {anyActive ? '● MODO GHOST ATIVO' : '○ KIT PAUSADO'}
            </span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-ghost-text">
            Bem-vindo ao{' '}
            <span className="text-ghost-green text-glow">Ghost Runner</span>
          </h1>
          <p className="text-ghost-muted text-sm mt-1">
            Seu kit anti-trabalho. Pareça ocupado, viva mais.
          </p>
        </div>
      </div>

      {/* Terminal status */}
      <div className="mb-8 p-4 rounded-xl bg-ghost-surface border border-ghost-border font-mono text-sm overflow-hidden">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-ghost-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-ghost-green/70" />
          </div>
          <span className="text-ghost-muted text-xs">fraudara — ghost-runner</span>
        </div>
        <div className="space-y-1.5 text-xs">
          <p className="text-ghost-dim">$ fraudara start --mode stealth</p>
          <p className="text-ghost-muted">→ inicializando módulos...</p>
          <p className={jigglerActive ? 'text-ghost-green' : 'text-ghost-dim'}>
            {jigglerActive ? '✓' : '○'} mouse jiggler{' '}
            {jigglerActive ? 'online · padrão humano' : 'offline'}
          </p>
          <p className={noiseActive ? 'text-ghost-green' : 'text-ghost-dim'}>
            {noiseActive ? '✓' : '○'} noise generator{' '}
            {noiseActive ? 'ready · loop ativo' : 'offline'}
          </p>
          <p className="text-ghost-green">
            ✓ auto-responder armed · jargão Pro
          </p>
          <p className="text-ghost-muted">
            › Status do Slack:{' '}
            <span className={anyActive ? 'text-ghost-green' : 'text-ghost-dim'}>
              {anyActive ? 'ativo' : 'inativo'}
            </span>
            <span className="animate-blink text-ghost-green">█</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          value={jigglerActive ? '●' : '○'}
          label="Mouse Jiggler"
          icon={Mouse}
          active={jigglerActive}
        />
        <StatCard
          value={noiseActive ? '●' : '○'}
          label="Ruído de Fundo"
          icon={Volume2}
          active={noiseActive}
        />
        <StatCard
          value={formatTime(sessionMinutes)}
          label="Horas poupadas"
          icon={Clock}
          active={sessionMinutes > 0}
        />
        <StatCard
          value={String(responsesCount)}
          label="Respostas geradas"
          icon={MessageSquare}
          active={responsesCount > 0}
        />
      </div>

      {/* Modules */}
      <div className="mb-6">
        <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-4">
          Módulos do kit
        </p>
        <div className="grid gap-3">
          <ModuleCard
            icon={Mouse}
            title="Módulo 01 — Mouse Jiggler Inteligente"
            description="Move o cursor em padrões bezier aleatórios e humanos. Slack verde, Teams sempre presente."
            active={jigglerActive}
            onClick={() => onNavigate('jiggler')}
          />
          <ModuleCard
            icon={Volume2}
            title="Módulo 02 — Gerador de Ruído de Fundo"
            description="Áudios realistas em loop: trânsito, hospital, aeroporto. Para quando o chefe ligar."
            active={noiseActive}
            onClick={() => onNavigate('noise')}
          />
          <ModuleCard
            icon={MessageSquare}
            title="Módulo 03 — Auto-Responder Corporativo Pro"
            description="Cole a mensagem do chefe. A IA responde com jargões que dão ilusão de produtividade."
            active={false}
            onClick={() => onNavigate('responder')}
          />
        </div>
      </div>

      {/* Tip */}
      <div className="p-4 rounded-xl bg-ghost-card border border-ghost-border flex items-start gap-3">
        <Shield size={16} className="text-ghost-green mt-0.5 flex-shrink-0" />
        <p className="text-xs text-ghost-muted font-mono leading-relaxed">
          <span className="text-ghost-green">Dica ghost:</span> Ative o Mouse Jiggler + Ruído de Fundo antes de qualquer reunião. Salve como preset "modo alinhando" para ativar com um clique.
        </p>
      </div>
    </div>
  );
}
