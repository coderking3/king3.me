import { defineConfig } from '@king-3/eslint-config'

export default defineConfig(
  {
    typescript: true,
    nextjs: true,
    ignores: ['./docs/**/*.md']
  },
  {
    name: 'custom-rules',
    rules: {
      'react/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'off',
      'react/purity': 'off',
      'typescript/no-use-before-define': [
        'error',
        { classes: false, functions: false, variables: false }
      ]
    }
  }
)
