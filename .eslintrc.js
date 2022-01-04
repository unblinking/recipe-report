module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off', // Explicit types required, even where they can be easily inferred by the compiler.
    '@typescript-eslint/explicit-function-return-type': 'off', // Disabled this rule for all files, in overrides we enable for ts only.
  },
  overrides: [
    {
      // Enable these rules specifically for TypeScript files.
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
      },
    },
  ],
}
