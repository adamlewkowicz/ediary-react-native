module.exports = {
  parser: '@typescript-eslint/parser',
  // root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    // '@react-native-community',
  ],
  ecmaFeatures:  {
    jsx:  true,
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
  }
};
