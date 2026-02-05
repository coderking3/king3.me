export interface Photo {
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

// [
//   'https://i0.hdslb.com/bfs/openplatform/4ab5f8290c9281aea91d6385b62f97eb1c0a03c2.png',
//   'https://i0.hdslb.com/bfs/openplatform/47696dfbc15966645d7d3374306e1e0976cb48b3.jpg',
//   'https://i0.hdslb.com/bfs/openplatform/110e6144aef41a2b01a49e2f040ff979c0e125eb.jpg',
//   'https://i0.hdslb.com/bfs/openplatform/8c8b12e1097d36605790a7a91e8e98968f7589f4.jpg',
//   'https://i0.hdslb.com/bfs/openplatform/36198b605b39580545fda23c8eac41be811332a1.jpg',
//   'https://i0.hdslb.com/bfs/openplatform/a7bbb2fdcb3a038410a53d123cdd54dbf700090a.png'
// ]

export { photos }
