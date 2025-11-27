/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Deep Space Academy Theme
        primary: {
          DEFAULT: '#D0BCFF',
          container: '#4F378B',
          on: '#381E72',
          'on-container': '#EADDFF',
        },
        secondary: {
          DEFAULT: '#CCC2DC',
          container: '#4A4458',
          on: '#332D41',
          'on-container': '#E8DEF8',
        },
        tertiary: {
          DEFAULT: '#EFB8C8',
          container: '#633B48',
          on: '#492532',
          'on-container': '#FFD8E4',
        },
        error: {
          DEFAULT: '#F2B8B5',
          container: '#8C1D18',
          on: '#601410',
          'on-container': '#F9DEDC',
        },
        surface: {
          DEFAULT: '#121212',
          dim: '#141218',
          bright: '#3B383E',
          'container-lowest': '#0F0D13',
          'container-low': '#1D1B20',
          container: '#211F26',
          'container-high': '#2B2930',
          'container-highest': '#36343B',
          // Surface tints (MD3 elevation without shadows)
          1: '#1E1B21',
          2: '#232027',
          3: '#28252C',
          4: '#2D2A32',
          5: '#322F38',
        },
        outline: {
          DEFAULT: '#938F99',
          variant: '#49454F',
        },
        'on-surface': '#E6E1E5',
        'on-surface-variant': '#CAC4D0',
        inverse: {
          surface: '#E6E1E5',
          'on-surface': '#313033',
          primary: '#6750A4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto Flex', 'system-ui', 'sans-serif'],
        display: ['Roboto Flex', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        // MD3 uses surface tints instead of shadows, but keeping subtle ones
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'elevation-2': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        glass: '16px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(208, 188, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(208, 188, 255, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
