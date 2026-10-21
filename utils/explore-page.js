const api = require('../api/post'),
  ui = require('./ui')
module.exports = function(defaults = {}) {
  return {
    data: {
      title: '校园发现',
      type: 'all',
      keyword: '',
      posts: [],
      loading: true,
      error: '',
      hasMore: false,
      page: 1
    },
    onLoad(options) {
      this.setData({
        title: ui.decodeQuery(options.title) || defaults.title || '校园发现',
        type: options.type || defaults.type || 'all',
        keyword: ui.decodeQuery(options.keyword)
      });
      wx.setNavigationBarTitle({
        title: this.data.title
      })
    },
    onShow() {
      this.load()
    },
    onPullDownRefresh() {
      this.load()
    },
    onReachBottom() {
      if (this.data.hasMore) this.load(true)
    },
    async load(more = false) {
      if (more === true && this.data.loading) return;
      more = more === true;
      this.setData({
        loading: true,
        error: ''
      });
      try {
        const type = this.data.type,
          page = more ? this.data.page + 1 : 1;
        const params = {
          keyword: this.data.keyword,
          page,
          pageSize: 10
        };
        if (type === 'mine') params.mine = true;
        else if (type === 'favorite') params.favorite = true;
        else if (type === 'history') params.history = true;
        else if (type === 'joined') params.joined = true;
        else params.type = type;
        const r = await api.getPostList(params);
        this.setData({
          posts: more ? this.data.posts.concat(r.list) : r.list,
          page,
          hasMore: r.hasMore
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
    retry() {
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
    onPostChange(e) {
    const changed = e.detail.post
    this.setData({ posts: this.data.posts.map(post => post.id === changed.id ? changed : post) })
  },
  openPost: ui.openPost,
    publish() {
      ui.compose(['mine', 'favorite', 'joined', 'history', 'all'].indexOf(this.data.type) > -1 ?
        'dynamic' : this.data.type)
    }
  }
}
