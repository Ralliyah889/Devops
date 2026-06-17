/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: 'var(--cyber-bg)',
          'bg-card': 'var(--cyber-bg-card)',
          'bg-card-hover': 'var(--cyber-bg-card-hover)',
          border: 'var(--cyber-border)',
          cyan: '#00f2fe',
          purple: '#9b5de5',
          pink: '#f15bb5',
          green: '#00f5d4',
          red: '#ff007f',
          yellow: '#ffb703',
          blue: '#00bbf9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Share Tech Mono', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 242, 254, 0.3), 0 0 20px rgba(0, 242, 254, 0.1)',
        'neon-purple': '0 0 10px rgba(155, 93, 229, 0.3), 0 0 20px rgba(155, 93, 229, 0.1)',
        'neon-green': '0 0 10px rgba(0, 245, 212, 0.3), 0 0 20px rgba(0, 245, 212, 0.1)',
        'neon-red': '0 0 10px rgba(255, 0, 127, 0.3), 0 0 20px rgba(255, 0, 127, 0.1)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cyber-scan': 'scan 8s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
