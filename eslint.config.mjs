import tseslint from 'typescript-eslint'
import node from 'eslint-plugin-node'
import importPlugin from 'eslint-plugin-import'
import jestPlugin from 'eslint-plugin-jest'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      import: importPlugin,
      node,
      jest: jestPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      'node/no-process-env': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name=env]',
          message: 'Indtead, use: import { env } from "lib/env"',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Проблемка с any
      'no-restricted-imports': 'off',

      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'never',
          warnOnUnassignedImports: true,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
            orderImportKind: 'asc',
          },
          pathGroups: [
            {
              pattern: '*.{css,scss}',
              group: 'object',
              position: 'before',
            },
          ],
        },
      ],
      'no-duplicate-imports': ['error', { includeExports: true }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
  {
    // enable jest rules on test files
    files: ['**/*.test.ts'],
    extends: [jestPlugin.configs['flat/recommended']],
  }
)
