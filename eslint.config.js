// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    // React Three Fiber JSX uses three.js props (position, geometry, args, attach...).
    // The React DOM rule doesn't know them, so it is off only for 3D scene files.
    files: ['src/features/plant3d/components/scene/**/*.tsx'],
    rules: { 'react/no-unknown-property': 'off' },
  },
]);
