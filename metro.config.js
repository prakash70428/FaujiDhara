// Metro is the bundler: it packs all our files into one bundle for the app.
// withNativeWind teaches Metro to read global.css and turn Tailwind classes into native styles.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
