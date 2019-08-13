module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: [
    './jest.setup',
    '@testing-library/react-native/cleanup-after-each',
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/__tests__/utils"
  ]
}
