import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const audioWide = localFont({
  src: '../../public/fonts/Audiowide-King3.woff2',
  variable: '--font-audiowide',
  weight: '400',
  display: 'swap',
  preload: true
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono'
})
