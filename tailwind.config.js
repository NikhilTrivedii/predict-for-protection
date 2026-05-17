/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefdfb',
          100: '#fdf8f0',
          200: '#f8ede0',
          300: '#f0dcc6',
          400: '#e5c8a8',
          500: '#d4a574',
          600: '#c4956a',
          700: '#a37a58',
          800: '#846349',
          900: '#6c513d',
        },
        rose: {
          medical: '#c4384b',
          soft: '#e8666f',
          light: '#fce8ea',
          glow: '#ff6b7a',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#cddacd',
          300: '#a8bfa8',
          400: '#7d9e7d',
          500: '#5d835d',
        },
        navy: {
          deep: '#1a2332',
          medium: '#2d3a4a',
          soft: '#4a5568',
        },
      },
      fontFamily: {
        heading: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      animation: {
        'rotate-heart': 'rotateHeart 25s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
      },
      keyframes: {
        rotateHeart: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg) rotateX(2deg) scale(1)' },
          '25%': { transform: 'perspective(1200px) rotateY(90deg) rotateX(-2deg) scale(1.02)' },
          '50%': { transform: 'perspective(1200px) rotateY(180deg) rotateX(2deg) scale(1)' },
          '75%': { transform: 'perspective(1200px) rotateY(270deg) rotateX(-2deg) scale(1.02)' },
          '100%': { transform: 'perspective(1200px) rotateY(360deg) rotateX(2deg) scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.12', transform: 'scale(1)' },
          '50%': { opacity: '0.18', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scanLine: {
          '0%': { top: '-10%' },
          '100%': { top: '110%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.05)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.03)' },
          '56%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
