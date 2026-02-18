const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuration pour les alias "@/"
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName.startsWith('@/')) {
      const fsPath = path.resolve(__dirname, moduleName.substring(2));
      return context.resolveRequest(context, fsPath, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

// Configuration pour SVG (si nécessaire)
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

module.exports = config;
