const posts = [{
    id: 'p1',
    type: 'dynamic',
    author: '橘子同学',
    avatar: '橘',
    tone: 'orange',
    time: '12 分钟前',
    location: '图书馆',
    title: '把秋天装进相册里 🍂',
    content: "原来最好的秋天，就藏在每天去上课的路上。图书馆旁的银杏已经黄了，趁着好天气，一起去收集校园里的小美好吧。",
    images: ['campus', 'sunset'],
    tag: '校园随手拍',
    likes: 128,
    views: 862,
    comments: 2
  },
  {
    id: 'p2',
    type: 'activity',
    author: '校窝活动站',
    avatar: '窝',
    tone: 'green',
    time: '28 分钟前',
    location: '操场东侧',
    title: '周五落日音乐会，把快乐调成现场模式',
    content: "带上野餐垫和好心情，一起在草坪上听歌。校园乐队、自由麦，还有属于你的第一排。\n时间：本周五 18:00—20:00\n地点：操场东侧草坪\n点击下方报名，来和同学们一起收藏这个傍晚。",
    images: ['concert'],
    tag: '周末去哪儿',
    likes: 96,
    views: 643,
    comments: 1,
    activityTime: '周五 18:00',
    capacity: 80
  },
  {
    id: 'p3',
    type: 'lost',
    author: '小林不迷路',
    avatar: '林',
    tone: 'blue',
    time: '45 分钟前',
    location: '第二食堂',
    title: '捡到一张校园卡，等一位粗心的同学',
    content: "今天中午在二食堂一楼靠窗的位置捡到校园卡，姓名尾字是「宇」。已经交给食堂服务台啦，失主记得带证件来领取。",
    images: [],
    tag: '拾物招领',
    likes: 32,
    views: 285,
    comments: 0
  },
  {
    id: 'p4',
    type: 'confession',
    author: '匿名的小星星',
    avatar: '星',
    tone: 'pink',
    time: '1 小时前',
    location: '校园',
    title: '想对今天帮我搬书的你说声谢谢',
    content: "从教学楼到宿舍的一路有点长，还好遇到了热心的你。虽然没来得及问名字，但希望这份小小的感谢能被你看到。",
    images: [],
    tag: '温暖瞬间',
    likes: 76,
    views: 419,
    comments: 1
  },
  {
    id: 'p5',
    type: 'treehole',
    author: '一颗小树',
    avatar: '树',
    tone: 'green',
    time: '2 小时前',
    location: '树洞',
    title: '允许自己偶尔慢一点，也没有关系吧',
    content: "最近在准备考试，看到身边的同学都很努力，有时候也会焦虑。今天给自己放了半天假，散步、吃饭、看了很久的天空，感觉又有了继续向前的力量。",
    images: ['sunset'],
    tag: '慢慢来就好',
    likes: 53,
    views: 321,
    comments: 0
  },
  {
    id: 'p6',
    type: 'forum',
    author: '阿七的自习室',
    avatar: '七',
    tone: 'blue',
    time: '3 小时前',
    location: '学习交流',
    title: '整理了一份图书馆宝藏座位指南',
    content: "想找安静的自习角落？三楼东侧靠窗的位置下午采光很好，二楼走廊尽头适合背书。欢迎大家在评论区分享自己的学习好去处，一起把期末稳稳拿下！",
    images: ['campus'],
    tag: '学习搭子',
    likes: 89,
    views: 571,
    comments: 1
  },
  {
    id: 'g1',
    type: 'idle',
    author: '小周同学',
    avatar: '周',
    tone: 'orange',
    time: '10 分钟前',
    location: '南区宿舍',
    title: '九成新头戴式耳机',
    content: "毕业整理闲置，耳罩干净，连接正常，附收纳袋。可以在南区食堂门口当面试用。",
    images: ['headphones'],
    tag: '数码好物',
    price: 129,
    original: 299,
    condition: '九成新',
    likes: 18,
    views: 152,
    comments: 0
  },
  {
    id: 'g2',
    type: 'idle',
    author: '夏日书架',
    avatar: '夏',
    tone: 'green',
    time: '30 分钟前',
    location: '图书馆',
    title: '考研英语资料整套出',
    content: "单词书、阅读练习和笔记一起出。部分有铅笔批注，适合需要学习资料的同学。",
    images: ['books'],
    tag: '学习资料',
    price: 35,
    original: 128,
    condition: '轻微使用',
    likes: 25,
    views: 211,
    comments: 0
  },
  {
    id: 'g3',
    type: 'inherit',
    author: '骑车的学长',
    avatar: '骑',
    tone: 'blue',
    time: '1 小时前',
    location: '北门',
    title: '陪我三年的校园单车',
    content: "下周离校，想把它交给下一位同学。车闸和车铃都正常，送车锁，希望它继续载着你看校园。",
    images: ['bike'],
    tag: '毕业传承',
    price: 88,
    original: 399,
    condition: '功能完好',
    likes: 31,
    views: 230,
    comments: 0
  },
  {
    id: 'g4',
    type: 'idle',
    author: '胶片日记',
    avatar: '片',
    tone: 'pink',
    time: '2 小时前',
    location: '东区宿舍',
    title: '复古小相机 · 留住日常',
    content: "入门练手相机，实拍可看，有正常使用痕迹。含存储卡，当面验机。",
    images: ['camera'],
    tag: '数码好物',
    price: 199,
    original: 480,
    condition: '八成新',
    likes: 41,
    views: 312,
    comments: 0
  },
  {
    id: 'g5',
    type: 'buy',
    author: '爱画画的小鱼',
    avatar: '鱼',
    tone: 'blue',
    time: '2 小时前',
    location: '艺术楼',
    title: '求购一块闲置数位板',
    content: "预算 150 元左右，新手练习用，功能正常即可，校园内可以当面交易。",
    images: [],
    tag: '求购专区',
    price: 150,
    likes: 6,
    views: 78,
    comments: 0
  },
  {
    id: 'g6',
    type: 'carpool',
    author: '周末出发',
    avatar: '行',
    tone: 'green',
    time: '3 小时前',
    location: '学校北门',
    title: '周六早上一起去高铁站',
    content: "周六早上 8:00 从北门出发，目前两人，想再找一位同学一起拼车。费用按实际行程 AA。",
    images: [],
    tag: '出行搭子',
    likes: 12,
    views: 131,
    comments: 0
  }
]
const comments = [{
    id: 'c1',
    postId: 'p1',
    author: '山风',
    avatar: '风',
    content: "下课就去！这个季节的校园太好看了。",
    time: '8 分钟前'
  },
  {
    id: 'c2',
    postId: 'p1',
    author: '小满',
    avatar: '满',
    content: "喜欢这样的校园日常～",
    time: '5 分钟前'
  },
  {
    id: 'c3',
    postId: 'p2',
    author: '听风',
    avatar: '听',
    content: "已经约好室友了，周五见！",
    time: '20 分钟前'
  },
  {
    id: 'c4',
    postId: 'p4',
    author: '小暖',
    avatar: '暖',
    content: "温柔的人总会遇到温柔的事。",
    time: '40 分钟前'
  },
  {
    id: 'c5',
    postId: 'p6',
    author: '早八人',
    avatar: '早',
    content: "收藏了，下次自习试试！",
    time: '1 小时前'
  }
]
const votes = [{
    id: 'v1',
    title: '今晚吃什么？食堂人气王投票',
    label: '校园生活',
    description: '每个人都有自己的食堂白月光，来为你最爱的窗口投一票。',
    total: 328,
    options: [{
      id: 'a',
      text: '二食堂 · 麻辣香锅',
      count: 146
    }, {
      id: 'b',
      text: '一食堂 · 番茄牛腩面',
      count: 103
    }, {
      id: 'c',
      text: '三食堂 · 烤盘饭',
      count: 79
    }]
  },
  {
    id: 'v2',
    title: '你希望校园市集多一些什么？',
    label: '一起共创',
    description: '让你的想法，成为下一次活动的主角。',
    total: 156,
    options: [{
      id: 'a',
      text: '手作与文创',
      count: 72
    }, {
      id: 'b',
      text: '二手书交换',
      count: 53
    }, {
      id: 'c',
      text: '校园乐队现场',
      count: 31
    }]
  }
]
module.exports = {
  posts,
  comments,
  votes
}
