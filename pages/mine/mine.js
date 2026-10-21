const ui = require('../../utils/ui'),
  req = require('../../utils/request')
Page({
  data: {
    userInfo: {},
    stats: {
      publish: 0,
      favorite: 0,
      joined: 0,
      orders: 0
    }
  },
  onShow() {
    ui.syncTab(this, 4);
    this.load()
  },
  async load() {
    try {
      const userInfo = await req.get('/api/v1/profile'),
        stats = await req.get('/api/v1/stats');
      this.setData({
        userInfo,
        stats
      })
    } catch (e) {
      ui.error(e)
    } finally {
      wx.stopPullDownRefresh()
    }
  },
  onPullDownRefresh() {
    this.load()
  },
  profile() {
    if (!wx.getStorageSync('userInfo')) wx.setStorageSync('userInfo', this.data.userInfo);
    wx.navigateTo({
      url: '/pages/mine-profile/mine-profile'
    })
  },
  setting() {
    wx.navigateTo({
      url: '/pages/mine-setting/mine-setting'
    })
  },
  publications() {
    wx.navigateTo({
      url: '/pages/mine-publish/mine-publish'
    })
  },
  favorites() {
    wx.navigateTo({
      url: '/pages/mine-favorite/mine-favorite'
    })
  },
  joined() {
    ui.list('joined', '我参与的活动')
  },
  orders() {
    wx.navigateTo({
      url: '/pages/help/help?mode=orders'
    })
  },
  history() {
    ui.list('history', '浏览记录')
  },
  messages() {
    wx.navigateTo({
      url: '/pages/help/help?mode=messages'
    })
  },
  feedback() {
    wx.navigateTo({
      url: '/pages/help/help?mode=feedback'
    })
  },
  guide() {
    wx.navigateTo({
      url: '/pages/help/help?mode=guide'
    })
  },
  about() {
    wx.navigateTo({
      url: '/pages/help/help?mode=about'
    })
  }
})
