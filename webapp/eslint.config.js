import baseConfig from '../eslint.config.js'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  extends: [...baseConfig],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@calendar-task-management/backend/**',
              '!@calendar-task-management/backend/**/',
              '!@calendar-task-management/backend/**/input',
              // '!@calendar-task-management/backend/**/router',
            ],
            allowTypeImports: true,
            message: 'Only types and input schemas are allowed to be imported from backend workspace',
          },
        ],
      },
    ],
  },
})
