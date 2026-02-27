export interface Song {
  name: string
  author: string[]
  cover: string
  url: string
  duration: string
}

const playlist: Song[] = [
  {
    name: '十面埋伏',
    author: ['陈奕迅'],
    cover:
      'https://p4.music.126.net/kAKoBg1AOVrgvO4WEOywoA==/109951169594708968.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/shi-mian-mai-fu.mp3',
    duration: '03:52'
  },
  {
    name: '葡萄成熟时',
    author: ['陈奕迅'],
    cover:
      'https://p3.music.126.net/W9imJx0w_JeCGGs43dfjFg==/109951171529987110.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/pu-tao-jin-xing-shi.mp3',
    duration: '04:39'
  },
  {
    name: '富士山下',
    author: ['陈奕迅'],
    cover:
      'https://p3.music.126.net/oSMs7RzJFx0TgWCqRC8XjA==/109951171844247587.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/fu-shi-shan-xia.mp3',
    duration: '04:18'
  },
  {
    name: '爱情转移',
    author: ['陈奕迅'],
    cover:
      'https://p3.music.126.net/o_OjL_NZNoeog9fIjBXAyw==/18782957139233959.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/ai-qing-zhuan-yi.mp3',
    duration: '04:19'
  },
  {
    name: '南方姑娘',
    author: ['赵雷'],
    cover:
      'https://p3.music.126.net/btBocL7KKvl0sRZY62_BIA==/109951169213244790.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/nan-fang-gu-niang.mp3',
    duration: '05:32'
  },
  {
    name: '朵',
    author: ['赵雷'],
    cover:
      'https://p4.music.126.net/-noYXenVuiTrlcxrCqNPjQ==/109951169213362679.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/duo.mp3',
    duration: '04:52'
  },
  {
    name: '无法长大',
    author: ['赵雷'],
    cover:
      'https://p3.music.126.net/_Vqc5fHr0bpKUhcPYwRAuA==/109951169213377544.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/wu-fa-chang-da.mp3',
    duration: '04:47'
  },
  {
    name: '晚风',
    author: ['7opy', 'BT07'],
    cover:
      'https://p4.music.126.net/lCblKUB1hLND5FxiVI1_Lw==/109951164919449758.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/wan-feng.mp3',
    duration: '03:22'
  },
  {
    name: '安和桥',
    author: ['宋冬野'],
    cover:
      'https://p4.music.126.net/GcRunGm02vZBicYmIN6GXw==/109951163200249252.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/an-he-qiao.mp3',
    duration: '04:10'
  },
  {
    name: '郭源潮',
    author: ['宋冬野'],
    cover:
      'https://p3.music.126.net/GkeTNB4NaPDTHASyDyJ3FA==/18878614649031775.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/guo-yuan-chao.mp3',
    duration: '07:25'
  },
  {
    name: '空港曲',
    author: ['宋冬野'],
    cover:
      'https://p3.music.126.net/8AXGUMnd2XfVvtpUvEoGtA==/18800549325215678.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/kong-gang-qu.mp3',
    duration: '05:00'
  },
  {
    name: '床',
    author: ['草东没有派对'],
    cover:
      'https://p3.music.126.net/m2uGF_-L70GUIB1MOpeaug==/109951168605260513.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/chuang.mp3',
    duration: '03:52'
  },
  {
    name: '为你唱首歌',
    author: ['痛仰乐队'],
    cover:
      'https://p4.music.126.net/la_yQfJiPmrDvVlaXbdhLA==/109951169200439396.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/wei-ni-chang-shou-ge.mp3',
    duration: '04:13'
  },
  {
    name: '红',
    author: ['罗言'],
    cover:
      'https://p3.music.126.net/G-inyKjA-jO5MuOuV3g7Pg==/109951167027986653.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/hong.mp3',
    duration: '02:41'
  }
]

function getRandomSongs(source: Song[] = playlist, count = 5): Song[] {
  const arr = source.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, Math.min(count, arr.length))
}

export { getRandomSongs, playlist }
