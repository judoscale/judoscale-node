import js from '@eslint/js'
import globals from 'globals'

const commonRules = {
  ...js.configs.recommended.rules,
  'no-redeclare': 'off',
  'no-unused-vars': 'off',
}

export default [
  {
    ignores: ['**/node_modules/**', '**/coverage/**', '**/.next/**', 'sample_apps/**/tmp/**'],
  },
  {
    files: ['packages/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: commonRules,
  },
  {
    files: ['packages/**/test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: commonRules,
  },
  {
    files: ['sample_apps/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: commonRules,
  },
]
