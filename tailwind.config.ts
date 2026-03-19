import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a1a1a',
        'slate-bg': '#f9fafb',
        'slate-text': '#334155',
        'corp-green': '#4F6BF6',
        'corp-green-dark': '#3D5BD9',
        'corp-green-light': '#eef1fe',
        border: '#e5e7eb',
        'border-dark': '#d1d5db',
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
