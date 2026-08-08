/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        akm: {
          purple: {
            deepest: "#05010B",
            dark: "#0F031E",
            base: "#1B0633",
            light: "#2B094E",
            bright: "#3D0F6E"
          },
          gold: {
            light: "#FFF8DC",
            mid: "#FFE169",
            royal: "#FFD700",
            dark: "#D4AF37",
            bronze: "#996515",
            deep: "#66430D"
          }
        }
      },
      fontFamily: {
        serif: ["'Cinzel'", "'Cormorant Garamond'", "Georgia", "serif"],
        garamond: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float-slow': 'floatSlow 6s infinite ease-in-out',
        'spin-slow': 'spinSlow 25s infinite linear',
        'light-sweep': 'lightSweep 2s ease-in-out'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.85))' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        lightSweep: {
          '0%': { transform: 'translateX(-100%) opacity(0)' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%) opacity(0)' }
        }
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #FFF8DC 0%, #FFD700 35%, #D4AF37 70%, #996515 100%)',
        'gold-shimmer': 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,248,220,0.9) 50%, rgba(255,215,0,0.1) 100%)'
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(255, 215, 0, 0.3)',
        'gold-glow-lg': '0 0 60px rgba(255, 215, 0, 0.5)',
        'glass': '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 248, 220, 0.35)'
      }
    },
  },
  plugins: [],
}
