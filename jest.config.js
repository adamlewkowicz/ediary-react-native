const jestPreset = require('@testing-library/react-native/jest-preset');

module.exports = {
  preset: '@testing-library/react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: [
    ...jestPreset.setupFiles,
    "@testing-library/react-native/cleanup-after-each",
    "./jest.setup.ts",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__/utils",
    "<rootDir>/__tests__/data",
    "<rootDir>/storybook",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@testing-library|react-navigation|@react-navigation/.*|react-native-ui-kitten|react-native-linear-gradient|react-native-svg|@react-native-community/slider|react-native-camera|react-native-screens|react-navigation-stack|react-navigation-tabs|react-native-swipe-gestures|react-native-gesture-handler|react-native-safe-area-view|react-native-svg-charts)/)"
  ],
}
