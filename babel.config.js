module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxRuntime: 'classic' }] // <-- Forcer le runtime JSX classique
    ],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: { '@': './' }
      }],
      ['@babel/plugin-transform-react-jsx', {
        runtime: 'automatic'
      }]
    ]
  };
};
