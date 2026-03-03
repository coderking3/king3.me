import { Roboto_Mono } from 'next/font/google' // 引入 字体
import localFont from 'next/font/local'

// Audiowide 使用本地子集字体
export const audioWide = localFont({
  src: '../../public/fonts/Audiowide-King3.woff2',
  variable: '--font-audiowide',
  weight: '400',
  display: 'swap',
  preload: true // 文件很小,可以预加载
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono'
})
