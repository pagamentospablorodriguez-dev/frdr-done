/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ghost: {
          bg: '#020f0a',
          surface: '#041a10',
          card: '#071f14',
          border: '#0d3320',
          green: '#00f5a0',
          'green-dim': '#00c47e',
          'green-muted': '#00a868',
          'green-faint': '#004d30',
          text: '#e8fff4',
          muted: '#6b9e82',
          dim: '#3a6b50',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px #00f5a0, 0 0 20px #00f5a0' },
          '100%': { textShadow: '0 0 20px #00f5a0, 0 0 40px #00f5a0, 0 0 60px #00c47e' },
        },
      },
      boxShadow: {
        'green-sm': '0 0 8px rgba(0, 245, 160, 0.3)',
        'green-md': '0 0 20px rgba(0, 245, 160, 0.3)',
        'green-lg': '0 0 40px rgba(0, 245, 160, 0.2)',
        'green-glow': '0 0 60px rgba(0, 245, 160, 0.15)',
      },
    },
  },
  plugins: [],
};
