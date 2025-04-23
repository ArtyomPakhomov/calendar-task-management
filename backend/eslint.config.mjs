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
  rules: {},
})
