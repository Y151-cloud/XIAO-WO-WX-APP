const api = require('../../api/post'),
  ui = require('../../utils/ui')
Page({
  data: {
    tabs: [{
      name: '全部',
      type: 'confession,treehole,forum'
    }, {
      name: '表白墙',
      type: 'confession'
    }, {
      name: '树洞',
      type: 'treehole'
    }, {
      name: '校园论坛',
      type: 'forum'
    }],
    active: 0,
    posts: [],
    loading: true,
    error: '',
    sort: 'new'
  },
  onShow() {
    ui.syncTab(this, 1);
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
        sort: this.data.sort
      });
      this.setData({
        posts: r.list
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
  changeSort() {
    this.setData({
      sort: this.data.sort === 'hot' ? 'new' : 'hot'
    });
    this.load()
  },
  onPostChange(e) {
    const changed = e.detail.post
    this.setData({ posts: this.data.posts.map(post => post.id === changed.id ? changed : post) })
  },
  openPost: ui.openPost,
  publish() {
    ui.compose(this.data.active === 0 ? 'forum' : this.data.tabs[this.data.active].type)
  },
  topic(e) {
    ui.list(e.currentTarget.dataset.type, e.currentTarget.dataset.title)
  }
})
