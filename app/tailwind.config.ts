import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',
          contrast: '#0B1220',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#06B6D4',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        text: '#111827',
        muted: '#6B7280',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(2,6,23,.08)'
      },
      borderRadius: {
        xl: '12px',
      }
    },
  },
  plugins: [],
} satisfies Config

