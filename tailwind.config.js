/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#F4F0EA',
          card: '#FDFBF7',
          sand: '#EAE3D2',
          sandDark: '#DCD2BB',
          cream: '#FAF7F2',
          charcoal: '#1B1D19',
          dark: '#141612',
          muted: '#78756E',
          lightMuted: '#A29D94',
          border: '#E2D9C8',
          borderDark: '#363832',
          bronze: '#C48439',
          wood: '#C48439',
          bronzeDark: '#A06827',
          bronzeLight: '#E9A550',
          sage: '#546644',
          olive: '#546644',
          sageDark: '#405032',
          sageLight: '#E6EDDF',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      boxShadow: {
        'luxury': '0 10px 40px -10px rgba(27, 29, 25, 0.08)',
        'luxury-hover': '0 20px 50px -10px rgba(27, 29, 25, 0.15)',
        'glow': '0 0 25px rgba(233, 165, 80, 0.3)',
        'sage-glow': '0 0 25px rgba(84, 102, 68, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
