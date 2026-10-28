/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────
//  The Garden Barber – Tailwind config
//  Brand colours live here. Change them once and rebuild:
//    npm install   (first time only)
//    npm run build
// ─────────────────────────────────────────────────────────────
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      // "short" = laptop screens that are wide but not very tall (e.g. 1280×720)
      screens: {
        xs: '400px',
        short: { raw: '(min-width: 1024px) and (max-height: 820px)' },
      },
      colors: {
        // Sage green – the logo background (#5a7765) with lighter and
        // darker steps built around it. 700 is the logo's own shading.
        sage: {
          50: '#f2f5f2',
          100: '#e4ebe5',
          200: '#c8d5cb',
          300: '#a3b8a9',
          400: '#7d9786',
          500: '#5a7765',
          600: '#4a6455',
          700: '#3d5546',
          800: '#2f4337',
          900: '#22312a',
          950: '#17211c',
        },
        // Near-black from the logo lettering, softened slightly for text
        ink: '#0d1611',
        // Warm off-white page background
        paper: '#f7f5ef',
        // Warm accent – the timber sleeper and Alderney gravel in their work photos
        sleeper: {
          200: '#efe2c8',
          300: '#e2c99c',
          400: '#d0ab6d',
          500: '#b98a4b',
          600: '#97703b',
        },
      },
      fontFamily: {
        // Josefin Sans – geometric capitals close to the logo lettering
        display: ['"Josefin Sans"', 'Futura', '"Century Gothic"', 'sans-serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      letterSpacing: {
        logo: '0.24em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23,33,28,.06), 0 10px 30px -14px rgba(23,33,28,.22)',
        lift: '0 2px 4px rgba(23,33,28,.06), 0 24px 50px -20px rgba(23,33,28,.35)',
      },
      keyframes: {
        snipA: {
          '0%, 34%, 100%': { transform: 'rotate(-11deg)' },
          '14%': { transform: 'rotate(-1deg)' },
        },
        snipB: {
          '0%, 34%, 100%': { transform: 'rotate(11deg)' },
          '14%': { transform: 'rotate(1deg)' },
        },
        clip: {
          '0%, 12%': { transform: 'translate(0,0) rotate(0deg)', opacity: '0' },
          '16%': { opacity: '1' },
          '60%': { opacity: '1' },
          '80%, 100%': { transform: 'translate(var(--dx, 10px), 70px) rotate(160deg)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2.5deg)' },
        },
        // The mower and the uncut grass in front of it move together,
        // leaving the striped lawn behind
        mow: {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '5%': { transform: 'translateX(0)', opacity: '1' },
          '80%, 100%': { transform: 'translateX(calc(100% + 160px))', opacity: '1' },
        },
      },
      animation: {
        snipA: 'snipA 2.4s ease-in-out infinite',
        snipB: 'snipB 2.4s ease-in-out infinite',
        clip: 'clip 2.4s ease-in infinite',
        sway: 'sway 7s ease-in-out infinite',
        mow: 'mow 18s linear infinite',
      },
    },
  },
  plugins: [],
};
