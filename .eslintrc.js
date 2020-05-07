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
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/prop-types': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'no-param-reassign': 2,
    '@typescript-eslint/no-use-before-define': 0,
    'react/display-name': 0,
  }
};
