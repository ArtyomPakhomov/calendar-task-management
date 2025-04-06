import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@calendar-task-management/backend/**',
                '!@calendar-task-management/backend/**/',
                '!@calendar-task-management/backend/**/input',
              ],
              allowTypeImports: true,
              message: 'Only types and input schemas are allowed to be imported from backend workspace',
            },
          ],
        },
      ],

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
