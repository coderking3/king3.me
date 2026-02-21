export interface Songs {
  name: string
  author: string[]
  cover: string
  url: string
}

const playlist: Songs[] = [
  /* 
    cover 图片参数：
      waadw=200y200 宽高
      type=webp 格式
  */
  {
    name: '十面埋伏',
    author: ['陈奕迅'],
    cover:
      'https://p4.music.126.net/kAKoBg1AOVrgvO4WEOywoA==/109951169594708968.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/shi-mian-mai-fu.mp3'
  },
  {
    name: '葡萄成熟时',
    author: ['陈奕迅'],
    cover:
      'https://p3.music.126.net/W9imJx0w_JeCGGs43dfjFg==/109951171529987110.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/pu-tao-jin-xing-shi.mp3'
  },
  {
    name: '富士山下',
    author: ['陈奕迅'],
    cover:
      'https://p3.music.126.net/oSMs7RzJFx0TgWCqRC8XjA==/109951171844247587.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/fu-shi-shan-xia.mp3'
  },
  {
    name: '爱情转移',
    author: ['陈奕迅'],
    cover:
      'https://p3.music.126.net/o_OjL_NZNoeog9fIjBXAyw==/18782957139233959.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/ai-qing-zhuan-yi.mp3'
  },
  {
    name: '南方姑娘',
    author: ['赵雷'],
    cover:
      'https://p3.music.126.net/btBocL7KKvl0sRZY62_BIA==/109951169213244790.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/nan-fang-gu-niang.mp3'
  },
  {
    cover:
      'https://p4.music.126.net/-noYXenVuiTrlcxrCqNPjQ==/109951169213362679.jpg',
    name: '朵',
    author: ['赵雷'],
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/duo.mp3'
  },

  {
    cover:
      'https://p3.music.126.net/_Vqc5fHr0bpKUhcPYwRAuA==/109951169213377544.jpg',
    name: '无法长大',
    author: ['赵雷'],
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/wu-fa-chang-da.mp3'
  },
  {
    cover:
      'https://p4.music.126.net/lCblKUB1hLND5FxiVI1_Lw==/109951164919449758.jpg',
    name: '晚风',
    author: ['7opy', 'BT07'],
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/wan-feng.mp3'
  },
  {
    name: '安和桥',
    author: ['宋冬野'],
    cover:
      'https://p4.music.126.net/GcRunGm02vZBicYmIN6GXw==/109951163200249252.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/an-he-qiao.mp3'
  },
  {
    name: '郭源潮',
    author: ['宋冬野'],
    cover:
      'https://p3.music.126.net/GkeTNB4NaPDTHASyDyJ3FA==/18878614649031775.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/guo-yuan-chao.mp3'
  },
  {
    name: '空港曲',
    author: ['宋冬野'],
    cover:
      'https://p3.music.126.net/8AXGUMnd2XfVvtpUvEoGtA==/18800549325215678.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/kong-gang-qu.mp3'
  },
  {
    name: '床',
    author: ['草东没有派对'],
    cover:
      'https://p3.music.126.net/m2uGF_-L70GUIB1MOpeaug==/109951168605260513.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/chuang.mp3'
  },
  {
    name: '为你唱首歌',
    author: ['痛仰乐队'],
    cover:
      'https://p4.music.126.net/la_yQfJiPmrDvVlaXbdhLA==/109951169200439396.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/wei-ni-chang-shou-ge.mp3'
  },
  {
    name: '红',
    author: ['罗言'],
    cover:
      'https://p3.music.126.net/G-inyKjA-jO5MuOuV3g7Pg==/109951167027986653.jpg',
    url: 'https://cdn.jsdelivr.net/gh/coderking3/static-playlist/hong.mp3'
  }
]

// 新增：洗牌然后取前 n 首（默认 5 首，不重复）
function getRandomSongs(source: Songs[] = playlist, count = 5): Songs[] {
  const arr = source.slice() // 复制，避免修改原数组
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, Math.min(count, arr.length))
}

export { getRandomSongs, playlist }
