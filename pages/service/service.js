const ui = require('../../utils/ui'),
  req = require('../../utils/request')
Page({
  data: {
    orders: [],
    loading: false
  },
  onShow() {
    ui.syncTab(this, 3);
    this.load()
  },
  async load() {
    try {
      const orders = await req.get('/api/v1/orders');
      this.setData({
        orders
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
  errand() {
    ui.compose('errand')
  },
  vote() {
    wx.navigateTo({
      url: '/pages/service-vote/service-vote'
    })
  },
  song() {
    ui.compose('song')
  },
  openLost() {
    ui.list('lost', '失物招领')
  },
  openOrders() {
    wx.navigateTo({
      url: '/pages/help/help?mode=orders'
    })
  },
  help() {
    wx.navigateTo({
      url: '/pages/help/help?mode=guide'
    })
  }
})
