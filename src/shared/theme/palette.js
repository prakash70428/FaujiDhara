// Single source of truth for app colors.
// Plain JS (CommonJS) so tailwind.config.js can require it; TS code imports it via ./colors.ts.
//
// primary = fauji olive green, earth = khet ki mitti, wheat = pakki fasal ka sunehra rang.

const palette = {
  primary: {
    50: '#F4F6EC',
    100: '#E4E9CF',
    200: '#C9D4A0',
    500: '#6B7A2E',
    600: '#556B2F',
    700: '#45561F',
    900: '#2A3412',
  },
  earth: {
    100: '#F1E6DA',
    500: '#8B5E3C',
    700: '#5E3E26',
  },
  wheat: {
    100: '#FBF1D6',
    400: '#E0B94A',
    600: '#B8902A',
  },
  background: '#FAF7F0',
  surface: '#FFFFFF',
  border: '#E5E0D5',
  ink: {
    DEFAULT: '#1F2418',
    muted: '#6B6F63',
  },
  danger: '#B3261E',
  success: '#2E7D32',
};

module.exports = { palette };
