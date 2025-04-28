import baseConfig from '../eslint.config.js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [...baseConfig],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    globals: globals.node,
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: '[object.name=console]',
        message: 'Indtead, use: import { logger } from "lib/logger"',
      },
    ],
  },
})
