/** Design tokens live here. Palette follows the AEVITWIN brand spec + MediTwin poster. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Text / surfaces (neutral, clinical)
        ink: '#14213D',      // --aevitwin-text
        navy: '#14213D',     // headings + doctor sidebar
        mist: '#F7FAFF',     // --aevitwin-background
        tint: '#EEF5FF',     // light-blue hover / selected background
        line: '#DCE7F5',     // --aevitwin-border
        muted: '#61718B',    // --aevitwin-muted
        subtle: '#61718B',   // same value; kept as an alias used across pages
        // The four brand colours (the primary gradient is built from exactly these, in this order)
        brand: { 1: '#AEE1FC', 2: '#60ABFB', 3: '#5170FD', 4: '#4636FC' },
        // Legacy class names remapped onto the brand colours so every page inherits the palette
        cyanx: '#60ABFB',
        bluex: '#5170FD',
        // Semantic status colours (health state only — never decoration)
        ok: '#1F9D6B',
        warn: '#C9741D',
        risk: '#D64545',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // no serif headings anywhere
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,33,61,.04)',
        lift: '0 12px 28px -12px rgba(20,33,61,.28)',
      },
      // Small, consistent corner radii (poster style) instead of large pills
      borderRadius: { xl: '0.5rem', '2xl': '0.75rem', '3xl': '1rem' },
    },
  },
  plugins: [],
};
