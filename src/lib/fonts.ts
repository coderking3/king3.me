import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const audioWide = localFont({
  src: '../../public/fonts/Audiowide-King3.woff2',
  variable: '--font-audiowide',
  weight: '400',
  display: 'swap',
  preload: true
})

export const wotfard = localFont({
  src: [
    {
      path: '../../public/fonts/Wotfard-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Wotfard-RegularItalic.woff2',
      weight: '400',
      style: 'italic'
    },
    {
      path: '../../public/fonts/Wotfard-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Wotfard-Semibold.woff2',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-wotfard',
  display: 'swap',
  preload: true,
  fallback: ['Arial'],
  adjustFontFallback: 'Arial'
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono'
})
