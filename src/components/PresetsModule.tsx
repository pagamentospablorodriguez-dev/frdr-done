import { useState } from 'react';
import { Settings, Save, Play, Square, Trash2, Plus, Zap, Info } from 'lucide-react';
import type { Module } from '../config';

interface PresetsProps {
  jigglerActive: boolean;
  noiseActive: boolean;
  onNavigate: (m: Module) => void;
}

type NoiseTrack = string;

interface Preset {
  id: string;
  name: string;
  emoji: string;
  jiggler: boolean;
  noise: boolean;
  noiseTrack: NoiseTrack;
  responderTone: string;
  description: string;
}

const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'ghost-mode',
    name: 'Modo Ghost',
    emoji: '👻',
    jiggler: true,
    noise: false,
    noiseTrack: 'traffic',
    responderTone: 'busy',
    description: 'Jiggler ligado, silêncio total. Para dias de home office tranquilo.',
  },
  {
    id: 'alinhando',
    name: 'Alinhando com o Time',
    emoji: '🤝',
    jiggler: true,
    noise: true,
    noiseTrack: 'office',
    responderTone: 'aligning',
    description: 'Jiggler + ruído de escritório + tom "alinhando". Parece que você está numa reunião.',
  },
  {
    id: 'emergencia',
    name: 'Emergência Médica',
    emoji: '🏥',
    jiggler: true,
    noise: true,
    noiseTrack: 'hospital',
    responderTone: 'escalating',
    description: 'Ruído de hospital ao fundo. Para cancelar qualquer reunião sem questionamentos.',
  },
  {
    id: 'viagem-negocios',
    name: 'Viagem de Negócios',
    emoji: '✈️',
    jiggler: true,
    noise: true,
    noiseTrack: 'airport',
    responderTone: 'delegating',
    description: 'Aeroporto ao fundo + delegando tudo. "Estou no saguão mas já resolvo".',
  },
  {
    id: 'preso-transito',
    name: 'Preso no Trânsito',
    emoji: '🚗',
    jiggler: false,
    noise: true,
    noiseTrack: 'traffic',
    responderTone: 'followup',
    description: 'Clássico. Buzinas, trânsito pesado. Chega em qualquer horário.',
  },
];

const NOISE_LABELS: Record<string, string> = {
  traffic: '🚗 Trânsito',
  hospital: '🏥 Hospital',
  airport: '✈️ Aeroporto',
  office: '🏢 Escritório',
  cafe: '☕ Café',
  rain: '🌧️ Chuva',
};

const TONE_LABELS: Record<string, string> = {
  busy: 'Ocupado',
  aligning: 'Alinhando',
  followup: 'Follow-up',
  escalating: 'Escalando',
  delegating: 'Delegando',
};

export default function PresetsModule({ jigglerActive, noiseActive, onNavigate }: PresetsProps) {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🚀');
  const [newDesc, setNewDesc] = useState('');

  const activatePreset = (preset: Preset) => {
    setActivePreset(prev => (prev === preset.id ? null : preset.id));
  };

  const deletePreset = (id: string) => {
    setPresets(p => p.filter(pr => pr.id !== id));
    if (activePreset === id) setActivePreset(null);
  };

  const saveNew = () => {
    if (!newName.trim()) return;
    const p: Preset = {
      id: Date.now().toString(),
      name: newName.trim(),
      emoji: newEmoji,
      jiggler: jigglerActive,
      noise: noiseActive,
      noiseTrack: 'traffic',
      responderTone: 'aligning',
      description: newDesc.trim() || 'Preset personalizado',
    };
    setPresets(prev => [...prev, p]);
    setCreating(false);
    setNewName('');
    setNewEmoji('🚀');
    setNewDesc('');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-ghost-green/10 text-ghost-green">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="font-mono font-bold text-ghost-text text-xl">Presets do Dia</h2>
            <p className="text-ghost-muted text-xs font-mono">Salve combinações e ative com um clique</p>
          </div>
        </div>
        <button
          onClick={() => setCreating(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ghost-green/30 bg-ghost-green/10 text-ghost-green text-xs font-mono hover:bg-ghost-green/20 transition-all"
        >
          <Plus size={14} />
          Novo preset
        </button>
      </div>

      {/* New preset form */}
      {creating && (
        <div className="mb-6 p-5 rounded-xl border border-ghost-green/30 bg-ghost-green/5">
          <p className="text-xs font-mono text-ghost-green uppercase tracking-wider mb-4">Criar preset do estado atual</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-[10px] font-mono text-ghost-muted uppercase tracking-wider block mb-1">Emoji</label>
              <input type="text" value={newEmoji} onChange={e => setNewEmoji(e.target.value)} className="w-full" maxLength={2} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-mono text-ghost-muted uppercase tracking-wider block mb-1">Nome</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do preset..." className="w-full" />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-[10px] font-mono text-ghost-muted uppercase tracking-wider block mb-1">Descrição</label>
            <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Para que serve esse preset?" className="w-full" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-ghost-muted mb-4 p-3 rounded-lg bg-ghost-card border border-ghost-border">
            <Info size={12} className="text-ghost-dim flex-shrink-0" />
            O preset vai capturar o estado atual do Jiggler ({jigglerActive ? 'ativo' : 'inativo'}) e do Ruído ({noiseActive ? 'ativo' : 'inativo'}).
          </div>
          <div className="flex gap-2">
            <button onClick={saveNew} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ghost-green text-ghost-bg text-xs font-mono font-bold hover:bg-ghost-green-dim transition-all">
              <Save size={13} />
              Salvar preset
            </button>
            <button onClick={() => setCreating(false)} className="px-4 py-2 rounded-lg border border-ghost-border text-ghost-muted text-xs font-mono hover:text-ghost-text transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Presets grid */}
      <div className="grid gap-4">
        {presets.map(preset => {
          const isActive = activePreset === preset.id;
          return (
            <div
              key={preset.id}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                isActive ? 'border-ghost-green/40 bg-ghost-green/5 shadow-green-sm' : 'border-ghost-border bg-ghost-card'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1">{preset.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className={`font-mono font-bold text-base ${isActive ? 'text-ghost-green' : 'text-ghost-text'}`}>
                      {preset.name}
                    </p>
                    {isActive && (
                      <span className="text-[10px] font-mono text-ghost-green bg-ghost-green/10 border border-ghost-green/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap size={9} />
                        ATIVO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ghost-muted mb-3 leading-relaxed">{preset.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[10px] font-mono px-2 py-1 rounded border ${preset.jiggler ? 'text-ghost-green bg-ghost-green/10 border-ghost-green/20' : 'text-ghost-dim border-ghost-border bg-ghost-surface'}`}>
                      {preset.jiggler ? '● Jiggler ON' : '○ Jiggler OFF'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-1 rounded border ${preset.noise ? 'text-ghost-green bg-ghost-green/10 border-ghost-green/20' : 'text-ghost-dim border-ghost-border bg-ghost-surface'}`}>
                      {preset.noise ? `● ${NOISE_LABELS[preset.noiseTrack]}` : '○ Sem Ruído'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded border text-ghost-muted border-ghost-border bg-ghost-surface">
                      Tom: {TONE_LABELS[preset.responderTone]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => activatePreset(preset)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                      isActive
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                        : 'bg-ghost-green text-ghost-bg hover:bg-ghost-green-dim'
                    }`}
                  >
                    {isActive ? <><Square size={12} /> Parar</> : <><Play size={12} /> Ativar</>}
                  </button>
                  {!DEFAULT_PRESETS.find(d => d.id === preset.id) && (
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ghost-border text-ghost-dim hover:text-red-400 hover:border-red-500/30 text-xs font-mono transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-ghost-card border border-ghost-border flex items-start gap-3">
        <Info size={14} className="text-ghost-muted mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs text-ghost-text font-mono font-medium mb-1">Como usar presets</p>
          <p className="text-xs text-ghost-muted font-mono leading-relaxed">
            Configure seus módulos nos respectivos painéis e clique em "Novo preset" para salvar o estado atual. Ative qualquer preset com um clique para mudar todo seu perfil ghost instantaneamente.
          </p>
        </div>
      </div>
    </div>
  );
}
