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
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react-refresh/only-export-components': 'off',
      'typescript/no-use-before-define': [
        'error',
        { classes: false, functions: false, variables: false }
      ]
    }
  },

  // 忽略对payload自动生成类型文件的进行校验
  {
    files: ['./payload-types.ts'],
    name: 'payload-type-rule',
    rules: {
      'eslint-comments/no-unlimited-disable': 'off'
    }
  }
)
