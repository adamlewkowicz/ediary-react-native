const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false
        }
      }),
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
      minifierPath: 'metro-minify-terser',
      minifierConfig: {
        // https://www.npmjs.com/package/terser#mangle-options
        ecma: 8,
        keep_classnames: true,
        keep_fnames: true,
        module: true,
        mangle: {
          module: true,
          keep_classnames: true,
          keep_fnames: true,
        }
      }
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"]
    },
  };
})();