module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [ 
        'react-native-reanimated/plugin', { relativeSourceLocation: false, },
      ]
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel', "transform-remove-console"],
      },
    },
  };
};

/*
 "react-native-document-scanner-plugin",
        {
          "cameraPermission": "We need camera access, so you can scan documents"
        }
        */