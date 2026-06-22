import { Ghost, Mouse, Volume2, MessageSquare, LayoutDashboard, Settings } from 'lucide-react';

export type Module = 'dashboard' | 'jiggler' | 'noise' | 'responder' | 'presets';

interface NavItem {
  id: Module;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jiggler', label: 'Mouse Jiggler', icon: Mouse },
  { id: 'noise', label: 'Ruído de Fundo', icon: Volume2 },
  { id: 'responder', label: 'Auto-Responder', icon: MessageSquare },
  { id: 'presets', label: 'Presets', icon: Settings },
];

export const LOGO_SRC = '/assets/IMG_3892.jpeg';
