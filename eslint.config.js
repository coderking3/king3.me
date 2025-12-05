import { defineConfig } from '@king-3/eslint-config'

export default defineConfig(
  {
    typescript: true,
    nextjs: true,
    ignores: ['**/(payload)/**/importMap.js']
  },
  {
    name: 'custom-rules',
    rules: {
      'react-refresh/only-export-components': 'off'
    }
  },

  {
    files: ['./payload-types.ts'],
    name: 'payload-rules',
    rules: {
      'eslint-comments/no-unlimited-disable': 'off'
    }
  }
)
