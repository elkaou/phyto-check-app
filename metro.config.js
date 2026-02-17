const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName.startsWith('@/')) {
      const path = moduleName.replace('@/', './');
      return context.resolveRequest(context, path, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
