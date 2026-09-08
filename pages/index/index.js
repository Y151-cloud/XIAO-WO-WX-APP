Page({
  data: {
    activeTab: 0
  },
  onLoad() {},
  onTabChange(e) {
    this.setData({ activeTab: e.detail.index })
  }
})