import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JigglerModule from './components/JigglerModule';
import NoiseModule from './components/NoiseModule';
import ResponderModule from './components/ResponderModule';
import PresetsModule from './components/PresetsModule';
import type { Module } from './config';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [jigglerActive, setJigglerActive] = useState(false);
  const [noiseActive, setNoiseActive] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [responsesCount, setResponsesCount] = useState(0);
  const [panicFlash, setPanicFlash] = useState(false);
  const sessionRef = useRef<ReturnType<typeof setInterval>>();

  const anyActive = jigglerActive || noiseActive;

  useEffect(() => {
    if (anyActive) {
      sessionRef.current = setInterval(() => setSessionMinutes(m => m + 1), 60000);
    } else {
      clearInterval(sessionRef.current);
    }
    return () => clearInterval(sessionRef.current);
  }, [anyActive]);

  // Global ESC panic
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && anyActive) {
        setJigglerActive(false);
        setNoiseActive(false);
        setPanicFlash(true);
        setTimeout(() => setPanicFlash(false), 1500);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [anyActive]);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActiveModule}
            jigglerActive={jigglerActive}
            noiseActive={noiseActive}
            sessionMinutes={sessionMinutes}
            responsesCount={responsesCount}
          />
        );
      case 'jiggler':
        return <JigglerModule active={jigglerActive} onToggle={setJigglerActive} />;
      case 'noise':
        return <NoiseModule active={noiseActive} onToggle={setNoiseActive} />;
      case 'responder':
        return <ResponderModule onResponse={() => setResponsesCount(c => c + 1)} />;
      case 'presets':
        return (
          <PresetsModule
            jigglerActive={jigglerActive}
            noiseActive={noiseActive}
            onNavigate={setActiveModule}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-ghost-bg bg-grid">
      <Sidebar
        active={activeModule}
        onNavigate={setActiveModule}
        statusGreen={anyActive}
      />

      <main className="flex-1 overflow-y-auto relative">
        {/* Panic flash overlay */}
        {panicFlash && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 pointer-events-none">
            <div className="flex items-center gap-3 px-8 py-5 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 font-mono font-bold text-lg">
              <AlertTriangle size={24} />
              MODO GHOST PAUSADO
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-ghost-bg/90 backdrop-blur-sm border-b border-ghost-border px-8 py-3 flex items-center justify-between">
          <p className="text-xs font-mono text-ghost-muted">
            <span className="text-ghost-dim">fraudara /</span>{' '}
            <span className="text-ghost-text">
              {activeModule === 'dashboard' ? 'dashboard'
                : activeModule === 'jiggler' ? 'mouse-jiggler'
                : activeModule === 'noise' ? 'noise-generator'
                : activeModule === 'responder' ? 'auto-responder'
                : 'presets'}
            </span>
          </p>
          <div className="flex items-center gap-4">
            {anyActive && (
              <div className="flex items-center gap-2 text-xs font-mono text-ghost-green">
                <span className="w-1.5 h-1.5 rounded-full bg-ghost-green animate-pulse-green" />
                kit ativo
              </div>
            )}
            <div className="text-xs font-mono text-ghost-dim">
              <kbd className="bg-ghost-surface border border-ghost-border px-1.5 py-0.5 rounded text-[10px]">ESC</kbd>
              {' '}panic
            </div>
          </div>
        </div>

        {renderModule()}
      </main>
    </div>
  );
}
