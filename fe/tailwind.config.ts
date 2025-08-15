import type { Config } from 'tailwindcss';
import { addDynamicIconSelectors, addIconSelectors } from '@iconify/tailwind';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    addDynamicIconSelectors(),
    addIconSelectors(['mdi', 'mdi-light', 'vscode-icons']),
  ],
} as Config;
