module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  extends: [
    'airbnb-typescript',
    ...require('eslint-config-airbnb').extends,
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    // Note: you must disable the base rule as it can report incorrect errors
    "ident": "off",
    "@typescript-eslint/indent": "warn"
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
};
