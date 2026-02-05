import { defineConfig } from '@king-3/eslint-config'

export default defineConfig(
  {
    typescript: true,
    nextjs: true
  },
  {
    name: 'custom-rules',
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react-refresh/only-export-components': 'off',
      'typescript/no-use-before-define': [
        'error',
        { classes: false, functions: false, variables: false }
      ]
    }
  },
  {
    files: ['./king-images.ts'],
    rules: {
      'perfectionist/sort-objects': [
        'warn',
        {
          type: 'alphabetical',
          order: 'asc',
          groups: [
            'id',
            'name',
            'url',
            'type',
            'width',
            'height',
            'date',
            'unknown'
          ],
          customGroups: [
            {
              groupName: 'id',
              elementNamePattern: '^id$'
            },
            {
              groupName: 'name',
              elementNamePattern: '^name$'
            },
            {
              groupName: 'url',
              elementNamePattern: '^url$'
            },
            {
              groupName: 'type',
              elementNamePattern: '^type$'
            },
            {
              groupName: 'width',
              elementNamePattern: '^width$'
            },
            {
              groupName: 'height',
              elementNamePattern: '^height$'
            },
            {
              groupName: 'date',
              elementNamePattern: '^date$'
            }
          ]
        }
      ]
    }
  }
)
