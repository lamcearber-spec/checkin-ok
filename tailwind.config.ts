import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a1f2e',
        'slate-bg': '#f8f9fa',
        'slate-text': '#334155',
        'corp-green': '#2d7a4f',
        'corp-green-dark': '#236b41',
        'corp-green-light': '#e8f5ee',
        border: '#e2e8f0',
        'border-dark': '#cbd5e1',
        error: '#dc2626',
        'error-light': '#fef2f2',
        warning: '#f59e0b',
        'warning-light': '#fffbeb',
        success: '#16a34a',
        'success-light': '#f0fdf4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
