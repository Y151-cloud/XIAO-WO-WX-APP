const api = require('../../api/post'),
  ui = require('../../utils/ui')
Page({
  data: {
    tabs: [{
      name: '好物推荐',
      type: 'idle,inherit'
    }, {
      name: '求购',
      type: 'buy'
    }, {
      name: '毕业传承',
      type: 'inherit'
    }, {
      name: '拼车拼团',
      type: 'carpool'
    }],
    active: 0,
    products: [],
    keyword: '',
    sort: 'new',
    loading: true,
    error: ''
  },
  onShow() {
    ui.syncTab(this, 2);
    this.load()
  },
  async load() {
    this.setData({
      loading: true,
      error: ''
    });
    try {
      const r = await api.getPostList({
        type: this.data.tabs[this.data.active].type,
        keyword: this.data.keyword,
        sort: this.data.sort
      });
      this.setData({
        products: r.list
      })
    } catch (e) {
      this.setData({
        error: e.message
      })
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
  changeTab(e) {
    this.setData({
      active: Number(e.currentTarget.dataset.index)
    });
    this.load()
  },
  input(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search() {
    this.load()
  },
  sort() {
    this.setData({
      sort: this.data.sort === 'price' ? 'new' : 'price'
    });
    this.load()
  },
  openPost: ui.openPost,
  publish() {
    ui.compose(this.data.active === 0 ? 'idle' : this.data.tabs[this.data.active].type)
  }
})
