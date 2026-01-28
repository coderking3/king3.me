interface Photo {
  alt: string
  src: string
  width: number
  height: number
  /** 照片时间戳  */
  date: number
}

const photos: Photo[] = [
  {
    alt: '三重冰岛.jpg',
    src: 'https://i0.hdslb.com/bfs/openplatform/020fda805e3b45f68510b34de463acb119cea8ce.jpg',
    width: 6501,
    height: 3323,
    date: 1749314020341
  },
  {
    alt: 'mac bg1',
    src: 'https://i0.hdslb.com/bfs/openplatform/6349a9c3364d378e1ec764616049ef3a0caa6c9b.webp',
    width: 1920,
    height: 1080,
    date: 1749314007716
  },
  {
    alt: 'Sunset over the mountains',
    src: 'https://example.com/photos/sunset.jpg',
    width: 1920,
    height: 1080,
    date: 1749314007716
  }
]

export default photos
