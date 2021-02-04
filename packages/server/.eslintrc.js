module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: { '@typescript-eslint/restrict-template-expressions': 'off' }
}
