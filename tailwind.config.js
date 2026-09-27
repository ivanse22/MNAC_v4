/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{tsx,ts}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        mnac: {
          bg: '#1F1F1F',          // MNAC Surface: Gris Carbón Cálido
          surface: '#262626',     // Slightly lighter for cards (Lifted)
          secondary: '#D1CCBF',   // MNAC Primary: Beige Piedra (Texto/Bordes)
          accent: '#F14A32',      // MNAC Accent: Bermellón (CTAs)
          
          // Legacy mappings for compatibility
          textPrimary: '#D1CCBF',
          textSecondary: '#9CA3AF', 
          
          // Remapping old branding to new
          black: '#1F1F1F',
          charcoal: '#262626',
          bone: '#D1CCBF',
          gold: '#D1CCBF',        // Replaced Gold with Beige for cleaner look
          red: '#F14A32',         // Replaced Red with Vermilion
          cream: '#1F1F1F',       // Replaced Cream backgrounds with Dark
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'], 
        display: ['"Manrope"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'] 
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-slow': 'scaleSlow 20s linear infinite alternate',
        'panel-slide-right': 'panelSlideRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleSlow: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        panelSlideRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}