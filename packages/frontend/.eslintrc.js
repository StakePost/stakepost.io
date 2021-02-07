module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'prettier/prettier': ['error'],
    'no-use-before-define': 'off',
    'no-param-reassign': ['error', { props: false }],
  },
  env: {
    browser: true,
    jest: true,
  },
};
