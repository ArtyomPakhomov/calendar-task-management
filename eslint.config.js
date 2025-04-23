import tseslint from 'typescript-eslint'
import node from 'eslint-plugin-node'
import importPlugin from 'eslint-plugin-import'

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
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-duplicate-imports': ['error', { includeExports: true }],
    },
  }
)
