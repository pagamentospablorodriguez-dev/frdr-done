import { Ghost, Mouse, Volume2, MessageSquare, LayoutDashboard, Settings, Zap } from 'lucide-react';
import type { Module } from '../config';

interface SidebarProps {
  active: Module;
  onNavigate: (m: Module) => void;
  statusGreen: boolean;
}

const navItems = [
  { id: 'dashboard' as Module, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jiggler' as Module, label: 'Mouse Jiggler', icon: Mouse },
  { id: 'noise' as Module, label: 'Ruído de Fundo', icon: Volume2 },
  { id: 'responder' as Module, label: 'Auto-Responder', icon: MessageSquare },
  { id: 'presets' as Module, label: 'Presets', icon: Settings },
];

export default function Sidebar({ active, onNavigate, statusGreen }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-ghost-surface border-r border-ghost-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-ghost-border flex items-center gap-3">
        <img
          src="/assets/IMG_3892.jpeg"
          alt="Fraudara"
          className="w-9 h-9 rounded-xl object-cover"
        />
        <div>
          <p className="font-mono font-bold text-ghost-green text-sm tracking-wider text-glow">
            FRAUDARA
          </p>
          <p className="text-ghost-muted text-xs font-mono">ghost-runner v2.4</p>
        </div>
      </div>

      {/* Status badge */}
      <div className="mx-4 mt-4 p-3 rounded-lg border border-ghost-border bg-ghost-card flex items-center gap-3">
        <div
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            statusGreen
              ? 'bg-ghost-green shadow-green-sm animate-pulse-green'
              : 'bg-ghost-dim'
          }`}
        />
        <div>
          <p className="text-xs font-mono font-medium text-ghost-text">
            {statusGreen ? 'Kit Ativo' : 'Kit Pausado'}
          </p>
          <p className="text-xs font-mono text-ghost-muted">
            {statusGreen ? 'status verde mantido' : 'pressione Panic para pausar'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 mt-2 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              active === id
                ? 'bg-ghost-green/10 text-ghost-green border border-ghost-green/30 shadow-green-sm'
                : 'text-ghost-muted hover:text-ghost-text hover:bg-ghost-card'
            }`}
          >
            <Icon size={16} />
            <span className="font-mono">{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-ghost-border">
        <div className="flex items-center gap-2 text-ghost-dim text-xs font-mono">
          <Zap size={12} />
          <span>© 2026 Fraudara.pro</span>
        </div>
      </div>
    </aside>
  );
}
