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
    files: ['./CLAUDE.md'],
    rules: {
      'yaml/no-empty-document': 'warn'
    }
  }
)
