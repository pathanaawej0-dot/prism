/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Google-Inspired Color Palette
        google: {
          blue: {
            50: '#E8F0FE',
            100: '#D2E3FC',
            200: '#AECBFA',
            300: '#8AB4F8',
            400: '#669DF6',
            500: '#4285F4', // Primary Google Blue
            600: '#1A73E8',
            700: '#1967D2',
            800: '#185ABC',
            900: '#174EA6',
          },
          red: {
            50: '#FCE8E6',
            100: '#FAD2CF',
            200: '#F6AEA9',
            300: '#F28B82',
            400: '#EE675C',
            500: '#EA4335', // Primary Google Red
            600: '#D93025',
            700: '#C5221F',
            800: '#B31412',
            900: '#A50E0E',
          },
          yellow: {
            50: '#FEF7E0',
            100: '#FEEFC3',
            200: '#FDE293',
            300: '#FDD663',
            400: '#FCC934',
            500: '#FBBC04', // Primary Google Yellow
            600: '#F9AB00',
            700: '#F29900',
            800: '#EA8600',
            900: '#E37400',
          },
          green: {
            50: '#E6F4EA',
            100: '#CEEAD6',
            200: '#A8DAB5',
            300: '#81C995',
            400: '#5BB974',
            500: '#34A853', // Primary Google Green
            600: '#1E8E3E',
            700: '#188038',
            800: '#137333',
            900: '#0D652D',
          },
        },
        // Enhanced Material Design 3 Colors
        primary: {
          DEFAULT: '#4285F4', // Google Blue
          light: '#669DF6',
          dark: '#1967D2',
          container: '#D2E3FC',
          on: '#FFFFFF',
          'on-container': '#174EA6',
        },
        secondary: {
          DEFAULT: '#34A853', // Google Green
          light: '#81C995',
          dark: '#188038',
          container: '#CEEAD6',
          on: '#FFFFFF',
          'on-container': '#0D652D',
        },
        tertiary: {
          DEFAULT: '#FBBC04', // Google Yellow
          light: '#FDD663',
          dark: '#F29900',
          container: '#FEEFC3',
          on: '#000000',
          'on-container': '#E37400',
        },
        error: {
          DEFAULT: '#EA4335', // Google Red
          light: '#F28B82',
          dark: '#C5221F',
          container: '#FAD2CF',
          on: '#FFFFFF',
          'on-container': '#A50E0E',
        },
        surface: {
          DEFAULT: '#0A0A0A',
          dim: '#0F0F0F',
          bright: '#2A2A2A',
          'container-lowest': '#050505',
          'container-low': '#121212',
          container: '#1A1A1A',
          'container-high': '#222222',
          'container-highest': '#2D2D2D',
          // Premium surface tints with subtle color
          1: '#0E0E10',
          2: '#131316',
          3: '#18181C',
          4: '#1D1D22',
          5: '#222228',
        },
        outline: {
          DEFAULT: '#8E8E93',
          variant: '#48484A',
        },
        'on-surface': '#F5F5F7',
        'on-surface-variant': '#C7C7CC',
        inverse: {
          surface: '#F5F5F7',
          'on-surface': '#1C1C1E',
          primary: '#1967D2',
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Product Sans"', 'Inter', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['"Google Sans Display"', '"Product Sans"', 'Roboto Flex', 'system-ui', 'sans-serif'],
        mono: ['"Google Sans Mono"', '"Roboto Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['2rem', { lineHeight: '1.25', letterSpacing: '0', fontWeight: '600' }],
        'headline-md': ['1.75rem', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.35', letterSpacing: '0', fontWeight: '500' }],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        'google-sm': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
        'google-md': '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
        'google-lg': '0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 8px 24px 4px rgba(60, 64, 67, 0.15)',
        'google-xl': '0 4px 16px 6px rgba(60, 64, 67, 0.15), 0 12px 36px 8px rgba(60, 64, 67, 0.15)',
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0 2px 6px rgba(0, 0, 0, 0.3), 0 8px 24px 4px rgba(0, 0, 0, 0.15)',
        'glow-blue': '0 0 20px rgba(66, 133, 244, 0.4), 0 0 40px rgba(66, 133, 244, 0.2)',
        'glow-green': '0 0 20px rgba(52, 168, 83, 0.4), 0 0 40px rgba(52, 168, 83, 0.2)',
        'glow-yellow': '0 0 20px rgba(251, 188, 4, 0.4), 0 0 40px rgba(251, 188, 4, 0.2)',
        'glow-red': '0 0 20px rgba(234, 67, 53, 0.4), 0 0 40px rgba(234, 67, 53, 0.2)',
      },
      backdropBlur: {
        glass: '16px',
        'glass-sm': '8px',
        'glass-lg': '24px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'google-gradient': 'linear-gradient(135deg, #4285F4 0%, #34A853 25%, #FBBC04 50%, #EA4335 75%, #4285F4 100%)',
        'google-mesh': 'radial-gradient(at 0% 0%, rgba(66, 133, 244, 0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(52, 168, 83, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(251, 188, 4, 0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(234, 67, 53, 0.2) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(66, 133, 244, 0.2), 0 0 10px rgba(66, 133, 244, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(66, 133, 244, 0.4), 0 0 40px rgba(66, 133, 244, 0.2)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(66, 133, 244, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(66, 133, 244, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      transitionTimingFunction: {
        'google': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'google-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'google-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'google-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
