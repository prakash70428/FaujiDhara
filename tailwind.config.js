const { palette } = require('./src/shared/theme/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind only generates classes it finds in these files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // 'class' = we decide dark mode ourselves (app is light-only for now, see app.json).
  // The default 'media' crashes NativeWind on web when the page toggles a color-scheme class.
  darkMode: 'class',
  theme: {
    extend: {
      colors: palette,
    },
  },
  plugins: [],
};
