const req = require('../../utils/request'),
  ui = require('../../utils/ui')
const titles = {
  guide: '小窝使用指南',
  feedback: '意见反馈',
  about: '关于校窝',
  messages: '我的消息',
  orders: '我的跑腿需求',
  songs: '我的点歌记录',
  chat: '联系同学',
  trade: '安心交易指南'
}
Page({
  data: {
    mode: 'guide',
    title: '小窝使用指南',
    content: '',
    contact: '',
    records: [],
    loading: false,
    sending: false,
    submitted: false,
    chat: [],
    message: '',
    post: null,
    questions: [{
      title: '怎么发布校园动态？',
      answer: '在首页点击「发动态」，写下标题与内容，最多可添加 3 张图片，也可以切换到失物招领、活动等分类。暂时没写完的内容可以先存草稿。'
    }, {
      title: '怎么找到收藏的内容？',
      answer: '打开内容详情，点击星星收藏。之后在「我的 → 我的收藏」中，就可以重新找到。'
    }, {
      title: '怎么参加校园活动？',
      answer: '打开活动详情，查看正文中的时间与地点，点击「我要参加」。在「我的 → 参与活动」中查看已报名的内容。'
    }, {
      title: '交易时要注意什么？',
      answer: '请先确认物品状态与价格，优先在校内公共场所见面验货。不要轻信陌生链接，不提前支付来源不明的保证金。'
    }, {
      title: '当前版本的数据会发出去吗？',
      answer: '这是界面体验版本。发布、评论、收藏、跑腿和点歌记录保存在本机。跑腿需求、点歌和聊天不会送达其他人；清除演示数据后记录会重置。'
    }]
  },
  onLoad(o) {
    const mode = o.mode || 'guide';
    this.setData({
      mode,
      title: titles[mode] || titles.guide
    });
    wx.setNavigationBarTitle({
      title: this.data.title
    });
    this.postId = o.postId || '';
    this.load()
  },
  async load() {
    this.setData({
      loading: true
    });
    try {
      if (this.data.mode === 'orders' || this.data.mode === 'songs') {
        const records = await req.get('/api/v1/' + this.data.mode);
        this.setData({
          records
        })
      }
      if (this.data.mode === 'chat') {
        const post = await req.get('/api/v1/post/' + this.postId),
          chat = wx.getStorageSync('xiaowo_chat_' + this.postId) || [];
        this.setData({
          post,
          chat
        });
        wx.setNavigationBarTitle({
          title: post.author
        })
      }
    } catch (e) {
      ui.error(e)
    } finally {
      this.setData({
        loading: false
      });
      wx.stopPullDownRefresh()
    }
  },
  onPullDownRefresh() {
    this.load()
  },
  field(e) {
    this.setData({
      [e.currentTarget.dataset.field]: e.detail.value
    })
  },
  async feedback() {
    if (this.data.sending) return;
    if (this.data.content.trim().length < 5) {
      wx.showToast({
        title: '再多写一点，至少 5 个字哦',
        icon: 'none'
      });
      return
    }
    this.setData({
      sending: true
    });
    try {
      await req.post('/api/v1/feedback', {
        content: this.data.content.trim(),
        contact: this.data.contact.trim()
      });
      this.setData({
        submitted: true,
        content: ''
      })
    } catch (e) {
      ui.error(e)
    } finally {
      this.setData({
        sending: false
      })
    }
  },
  sendMessage() {
    const content = this.data.message.trim();
    if (!content) return;
    const chat = this.data.chat.concat({
      id: Date.now(),
      content,
      time: '刚刚'
    });
    wx.setStorageSync('xiaowo_chat_' + this.postId, chat);
    this.setData({
      chat,
      message: ''
    })
  },
  home() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  service() {
    wx.switchTab({
      url: '/pages/service/service'
    })
  }
})
