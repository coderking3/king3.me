export interface Project {
  name: string
  description: string
  link: string
  icon: string
}

const projects: Project[] = [
  {
    name: 'King Images',
    description:
      'Powerful image upload and management tool with multi-format support',
    link: 'https://king-images.vercel.app/',
    icon: 'https://i0.hdslb.com/bfs/openplatform/3f7f3e806efbc482271c3e2808c02c24d26d28c1.png'
  },
  {
    name: 'Better Mock Server',
    description: 'Lightweight and fast mock server library built on unjs/h3',
    link: 'https://github.com/OpenKnights/better-mock-server',
    icon: 'https://i0.hdslb.com/bfs/openplatform/83532bd0bcbe7e510511db0814e8a60f12386c02.png'
  },
  {
    name: 'Eslint Config',
    description: "king3's ESLint config preset",
    link: 'https://github.com/coderking3/eslint-config',
    icon: 'https://i0.hdslb.com/bfs/openplatform/4d984231215953e1f3fa25e60439053798ada67c.png'
  },
  {
    name: 'Prettier config',
    description: "king3's Prettier config preset",
    link: 'https://github.com/coderking3/prettier-config',
    icon: 'https://i0.hdslb.com/bfs/openplatform/52dca92eb9ed9c7063eb3b8f3748035585e62dcf.png'
  },
  {
    name: 'Storadapt',
    description:
      'Flexible storage adapter with deep path access and auto-serialization',
    link: 'https://github.com/OpenKnights/storadapt',
    icon: 'https://i0.hdslb.com/bfs/openplatform/86cfd9951b77c987a03939dfc0b7d5af180989a6.png'
  },
  {
    name: 'Evenex',
    description: 'Lightweight, type-safe event emitter / event bus library',
    link: 'https://github.com/OpenKnights/evenex',
    icon: 'https://i0.hdslb.com/bfs/openplatform/ecb6900271fb0b0b5f7875a6f6373b97fc64e13c.png'
  },
  {
    name: 'Kedash',
    description:
      'Functional utility library - modern, simple, typed, powerful ',
    link: 'https://github.com/OpenKnights/kedash',
    icon: 'https://i0.hdslb.com/bfs/openplatform/e6a2f8851994e11e2eae1ff2598fe0c84677f6d9.png'
  },
  {
    name: 'Veloxa',
    description: 'Fast, native HTTP client built on Fetch API',
    link: 'https://github.com/OpenKnights/veloxa',
    icon: 'https://i0.hdslb.com/bfs/openplatform/0cf3bfa3c198137e68bd3c75178b206c19fbdd75.png'
  },
  {
    name: 'File Kit',
    description: '多功能文件工具箱 — Base64 转换 · 视频转音频 · 加密/解密',
    link: 'https://github.com/coderking3/file-kit',
    icon: 'https://i0.hdslb.com/bfs/openplatform/3074259d9237b5c497ff8bf9d4590baa6aefd8a1.png'
  },
  {
    name: 'VS Code Profile',
    description: "king3's VS Code configuration preset",
    link: 'https://github.com/coderking3/vscode-profile',
    icon: 'https://i0.hdslb.com/bfs/openplatform/d6268f0ecdda768503d6a93a90632ec5f6e5627c.png'
  },
  {
    name: 'vite-plugin-intunnel',
    description: 'Vite plugin for securely exposing local servers via Ngrok',
    link: 'https://github.com/coderking3/vite-plugin-intunnel',
    icon: 'https://i0.hdslb.com/bfs/openplatform/31c4ff8d08558e6381372b8883efac9984d91339.png'
  }
]

export { projects }
