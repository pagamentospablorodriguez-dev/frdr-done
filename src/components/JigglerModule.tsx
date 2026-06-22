import { useState } from 'react';
import {
  Download, Terminal, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle,
  Monitor, Apple, Cpu, Play, Square, Mouse,
} from 'lucide-react';

interface JigglerProps {
  active: boolean;
  onToggle: (v: boolean) => void;
}

type Profile = 'human' | 'subtle' | 'aggressive';
type OS = 'windows' | 'mac' | 'linux';

const PROFILES: { id: Profile; label: string; desc: string; interval: number; amplitude: number; speed: number }[] = [
  { id: 'human',      label: 'Humano',     desc: 'Movimentos naturais com curvas bezier — indetectável por qualquer ferramenta de monitoramento', interval: 4.5, amplitude: 200, speed: 0.8 },
  { id: 'subtle',     label: 'Sutil',      desc: 'Micromovimentos quase imperceptíveis — ideal pra quem usa monitor externo visível por outros', interval: 8.0, amplitude: 60,  speed: 1.2 },
  { id: 'aggressive', label: 'Agressivo',  desc: 'Movimentos amplos e frequentes — para softwares de monitoramento mais rígidos', interval: 1.8, amplitude: 350, speed: 0.4 },
];

const OS_INSTRUCTIONS: Record<OS, { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; steps: string[] }> = {
  windows: {
    icon: Monitor,
    label: 'Windows',
    steps: [
      'Baixe o arquivo <code>ghost_jiggler.py</code> clicando no botão acima',
      'Instale o Python: acesse <strong>python.org/downloads</strong>, baixe o instalador e marque a opção <strong>"Add Python to PATH"</strong> durante a instalação',
      'Abra o <strong>Prompt de Comando</strong> (Win + R, digite <code>cmd</code>, Enter)',
      'Cole e execute: <code>pip install pyautogui</code> — aguarde instalar',
      'Navegue até onde salvou o arquivo: <code>cd Downloads</code>',
      'Rode o jiggler: <code>python ghost_jiggler.py</code>',
      'O cursor vai começar a se mover sozinho. Para parar: <strong>Ctrl+C</strong> ou mova o cursor para o canto superior esquerdo da tela',
    ],
  },
  mac: {
    icon: Apple,
    label: 'Mac',
    steps: [
      'Baixe o arquivo <code>ghost_jiggler.py</code> clicando no botão acima',
      'Abra o <strong>Terminal</strong> (Cmd + Espaço, digite "Terminal")',
      'Instale o Python se não tiver: <code>brew install python</code> (precisa do Homebrew, ou baixe em python.org)',
      'Instale a dependência: <code>pip3 install pyautogui</code>',
      'Navegue para a pasta: <code>cd Downloads</code>',
      'Dê permissão de acessibilidade: Preferências > Privacidade > Acessibilidade > adicione o Terminal',
      'Rode: <code>python3 ghost_jiggler.py</code>',
      'Para parar: <strong>Ctrl+C</strong> ou mova o cursor para o canto superior esquerdo',
    ],
  },
  linux: {
    icon: Cpu,
    label: 'Linux',
    steps: [
      'Baixe o arquivo <code>ghost_jiggler.py</code> clicando no botão acima',
      'Abra o <strong>Terminal</strong>',
      'Instale dependências: <code>sudo apt install python3 python3-pip python3-tk python3-dev scrot</code>',
      'Instale pyautogui: <code>pip3 install pyautogui</code>',
      'Navegue para a pasta: <code>cd ~/Downloads</code>',
      'Rode: <code>python3 ghost_jiggler.py</code>',
      'Para parar: <strong>Ctrl+C</strong>',
    ],
  },
};

function generateScript(profile: Profile): string {
  const cfg = PROFILES.find(p => p.id === profile)!;
  return `#!/usr/bin/env python3
"""
=================================================
  FRAUDARA — Ghost Jiggler v2.4
  Kit de sobrevivencia anti-trabalho
  fraudara.pro
=================================================

Como parar: Ctrl+C no terminal
            OU mova o cursor pro canto superior
            esquerdo da tela (failsafe)

Requisito: pip install pyautogui
"""

import pyautogui
import random
import time
import sys

# ── Configuracao ──────────────────────────────
PERFIL        = "${profile}"
INTERVALO     = ${cfg.interval}    # segundos entre movimentos
AMPLITUDE     = ${cfg.amplitude}   # pixels de deslocamento maximo
DURACAO_MOVE  = ${cfg.speed}       # segundos por movimento
# ─────────────────────────────────────────────

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0


def ease_in_out(t):
    return t * t * (3 - 2 * t)


def bezier_cubic(t, p0, p1, p2, p3):
    u = 1 - t
    return (
        u**3 * p0[0] + 3*u**2*t * p1[0] + 3*u*t**2 * p2[0] + t**3 * p3[0],
        u**3 * p0[1] + 3*u**2*t * p1[1] + 3*u*t**2 * p2[1] + t**3 * p3[1],
    )


def mover_humano(alvo_x, alvo_y):
    sx, sy = pyautogui.position()
    dx, dy = alvo_x - sx, alvo_y - sy

    # Pontos de controle com variacao humana
    cp1 = (sx + dx * 0.25 + random.randint(-60, 60),
           sy + dy * 0.10 + random.randint(-40, 40))
    cp2 = (sx + dx * 0.75 + random.randint(-60, 60),
           sy + dy * 0.90 + random.randint(-40, 40))

    steps = max(30, int(DURACAO_MOVE * 60))
    for i in range(steps + 1):
        t = ease_in_out(i / steps)
        x, y = bezier_cubic(t, (sx, sy), cp1, cp2, (alvo_x, alvo_y))
        pyautogui.moveTo(int(x), int(y), _pause=False)
        time.sleep(DURACAO_MOVE / steps)


def main():
    largura, altura = pyautogui.size()

    print()
    print("  ╔════════════════════════════════════╗")
    print("  ║   FRAUDARA — Ghost Jiggler v2.4   ║")
    print("  ║   fraudara.pro                     ║")
    print("  ╚════════════════════════════════════╝")
    print()
    print(f"  Perfil   : {PERFIL}")
    print(f"  Intervalo: {INTERVALO}s")
    print(f"  Amplitude: {AMPLITUDE}px")
    print(f"  Resolucao: {largura}x{altura}")
    print()
    print("  Status do Slack / Teams: VERDE")
    print()
    print("  Para parar: Ctrl+C ou mova o cursor")
    print("  para o canto superior esquerdo.")
    print()

    contagem = 0
    while True:
        try:
            cx, cy = pyautogui.position()

            jx = random.randint(-AMPLITUDE, AMPLITUDE)
            jy = random.randint(-AMPLITUDE, AMPLITUDE)

            tx = max(80, min(largura - 80, cx + jx))
            ty = max(80, min(altura - 80, cy + jy))

            mover_humano(int(tx), int(ty))

            contagem += 1
            hora = time.strftime("%H:%M:%S")
            print(f"  [{hora}] movimento #{contagem:04d}  ->  ({int(tx)}, {int(ty)})")

            # Variacao humana no intervalo
            espera = INTERVALO + random.uniform(-INTERVALO * 0.3, INTERVALO * 0.3)
            time.sleep(max(0.5, espera))

        except pyautogui.FailSafeException:
            print()
            print("  [Fraudara] Failsafe ativado — cursor no canto. Jiggler pausado.")
            sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        print("  [Fraudara] Jiggler pausado via Ctrl+C.")
        print("  Status pode voltar para ausente em alguns minutos.")
        sys.exit(0)
`;
}

export default function JigglerModule({ active, onToggle }: JigglerProps) {
  const [profile, setProfile] = useState<Profile>('human');
  const [os, setOs] = useState<OS>('windows');
  const [openStep, setOpenStep] = useState<number | null>(null);

  const osInfo = OS_INSTRUCTIONS[os];

  const handleDownload = () => {
    const script = generateScript(profile);
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghost_jiggler.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-ghost-green/10 text-ghost-green">
            <Mouse size={20} />
          </div>
          <div>
            <h2 className="font-mono font-bold text-ghost-text text-xl">Mouse Jiggler Inteligente</h2>
            <p className="text-ghost-muted text-xs font-mono">Módulo 01 · executável nativo · move o cursor de verdade</p>
          </div>
        </div>
      </div>

      {/* Profile selector */}
      <div className="mb-6">
        <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-3">Perfil de movimento</p>
        <div className="grid grid-cols-3 gap-3">
          {PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                profile === p.id
                  ? 'border-ghost-green/40 bg-ghost-green/5 shadow-green-sm'
                  : 'border-ghost-border bg-ghost-card hover:border-ghost-green/20'
              }`}
            >
              <p className={`text-sm font-mono font-semibold mb-1.5 ${profile === p.id ? 'text-ghost-green' : 'text-ghost-text'}`}>
                {p.label}
              </p>
              <p className="text-[11px] text-ghost-muted leading-relaxed">{p.desc}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-[10px] font-mono text-ghost-dim">a cada {p.interval}s</span>
                <span className="text-[10px] font-mono text-ghost-dim">{p.amplitude}px</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Download CTA */}
      <div className="mb-8 p-6 rounded-2xl border border-ghost-green/30 bg-ghost-green/5">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono font-bold text-ghost-text text-base mb-1">
              Ghost Jiggler — <span className="text-ghost-green">ghost_jiggler.py</span>
            </p>
            <p className="text-xs text-ghost-muted font-mono mb-3 leading-relaxed">
              Script Python que move o cursor <strong className="text-ghost-text">fisicamente no seu SO</strong> com curvas bezier humanizadas. Roda em background. Compatível com Windows, Mac e Linux.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Windows ✓', 'Mac ✓', 'Linux ✓', 'Slack ✓', 'Teams ✓', 'Zoom ✓'].map(tag => (
                <span key={tag} className="text-[10px] font-mono text-ghost-green bg-ghost-green/10 border border-ghost-green/20 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-ghost-green text-ghost-bg hover:bg-ghost-green-dim shadow-green-md transition-all font-mono font-bold text-sm"
          >
            <Download size={20} />
            Baixar
          </button>
        </div>
      </div>

      {/* OS selector */}
      <div className="mb-5">
        <p className="text-xs font-mono text-ghost-muted uppercase tracking-widest mb-3">Instruções de instalação</p>
        <div className="flex gap-2 mb-5">
          {(['windows', 'mac', 'linux'] as OS[]).map(o => {
            const { icon: Icon, label } = OS_INSTRUCTIONS[o];
            return (
              <button
                key={o}
                onClick={() => setOs(o)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono transition-all ${
                  os === o
                    ? 'border-ghost-green/40 bg-ghost-green/10 text-ghost-green'
                    : 'border-ghost-border bg-ghost-card text-ghost-muted hover:text-ghost-text'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {osInfo.steps.map((step, i) => (
            <div
              key={i}
              className="rounded-xl border border-ghost-border bg-ghost-card overflow-hidden"
            >
              <button
                onClick={() => setOpenStep(openStep === i ? null : i)}
                className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-ghost-surface/50 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-ghost-green/10 border border-ghost-green/30 text-ghost-green text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span
                  className="flex-1 text-sm text-ghost-text font-mono"
                  dangerouslySetInnerHTML={{ __html: step.replace(/<code>/g, '<code class="text-ghost-green bg-ghost-surface px-1.5 py-0.5 rounded text-xs">').replace(/<strong>/g, '<strong class="text-ghost-text">') }}
                />
                {openStep === i ? (
                  <ChevronUp size={14} className="text-ghost-muted flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-ghost-muted flex-shrink-0" />
                )}
              </button>
              {openStep === i && (
                <div className="px-4 pb-4 pt-1 border-t border-ghost-border">
                  <div className="p-3 rounded-lg bg-ghost-surface border border-ghost-border">
                    <p
                      className="text-xs text-ghost-muted font-mono leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step.replace(/<code>/g, '<code class="text-ghost-green bg-ghost-bg px-1.5 py-0.5 rounded">').replace(/<strong>/g, '<strong class="text-ghost-text">') }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Terminal preview */}
      <div className="mb-6 rounded-xl border border-ghost-border bg-ghost-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-ghost-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-ghost-green/70" />
          </div>
          <span className="text-xs font-mono text-ghost-muted">Terminal</span>
        </div>
        <div className="p-4 font-mono text-xs space-y-1.5">
          <p className="text-ghost-dim">$ python ghost_jiggler.py</p>
          <p className="text-ghost-muted">&nbsp;</p>
          <p className="text-ghost-green">  ╔════════════════════════════════════╗</p>
          <p className="text-ghost-green">  ║   FRAUDARA — Ghost Jiggler v2.4   ║</p>
          <p className="text-ghost-green">  ╚════════════════════════════════════╝</p>
          <p className="text-ghost-muted">&nbsp;</p>
          <p className="text-ghost-text">  Perfil   : {profile}</p>
          <p className="text-ghost-text">  Status do Slack / Teams: <span className="text-ghost-green">VERDE</span></p>
          <p className="text-ghost-muted">&nbsp;</p>
          <p className="text-ghost-muted">  [09:14:32] movimento #0001  -&gt;  (847, 412)</p>
          <p className="text-ghost-muted">  [09:14:37] movimento #0002  -&gt;  (1023, 389)</p>
          <p className="text-ghost-muted">  [09:14:41] movimento #0003  -&gt;  (756, 521)<span className="animate-blink text-ghost-green">█</span></p>
        </div>
      </div>

      {/* FAQ small */}
      <div className="space-y-3">
        {[
          {
            q: 'Precisa deixar o terminal aberto?',
            a: 'Sim, pode minimizar à vontade, mas o terminal precisa estar rodando. No Windows você pode clicar com botão direito na barra de tarefas e fixar. No Mac, minimize normalmente.',
          },
          {
            q: 'O chefe consegue ver que o script está rodando?',
            a: 'Não. O script roda localmente no seu computador como qualquer outro processo Python. Ferramentas de monitoramento remoto como Teramind ou Hubstaff rastreiam screenshots e uso de aplicativos — não processos do terminal.',
          },
          {
            q: 'Por que Python e não um .exe?',
            a: 'Executáveis .exe desconhecidos são bloqueados por antivírus e políticas corporativas de segurança. Python é transparente, auditável e confiável. O script tem apenas 80 linhas que você pode ler e verificar.',
          },
          {
            q: 'Como parar rapidamente em caso de emergência?',
            a: 'Ctrl+C no terminal para imediatamente. Ou mova o cursor para o canto superior esquerdo da tela — o failsafe do PyAutoGUI encerra o processo na hora.',
          },
        ].map(({ q, a }, i) => (
          <div key={i} className="rounded-xl border border-ghost-border bg-ghost-card overflow-hidden">
            <button
              onClick={() => setOpenStep(openStep === 100 + i ? null : 100 + i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="text-sm font-mono text-ghost-text">{q}</span>
              {openStep === 100 + i ? <ChevronUp size={14} className="text-ghost-muted flex-shrink-0" /> : <ChevronDown size={14} className="text-ghost-muted flex-shrink-0" />}
            </button>
            {openStep === 100 + i && (
              <div className="px-4 pb-4 border-t border-ghost-border pt-3">
                <p className="text-xs text-ghost-muted font-mono leading-relaxed">{a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
