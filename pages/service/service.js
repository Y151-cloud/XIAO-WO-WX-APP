Page({
  data: {
    activeTab: 0
  },

  onLoad() {},

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ active: 3 })
    }
  },

  onTabChange(e) {
    this.setData({ activeTab: e.detail.index || e.detail.name })
  },

  onErrandTap() {
    wx.navigateTo({ url: '/pages/service-errand/service-errand' })
  },

  onVoteTap() {
    wx.navigateTo({ url: '/pages/service-vote/service-vote' })
  },

  onSongTap() {
    wx.navigateTo({ url: '/pages/service-song/service-song' })
  }
})