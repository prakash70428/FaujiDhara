// Babel converts our modern TypeScript/JSX into JavaScript that the phone understands.
// The NativeWind preset makes the `className="..."` prop work on React Native components.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
