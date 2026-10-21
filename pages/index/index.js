const api = require('../../api/post'),
  ui = require('../../utils/ui')
Page({
  data: {
    tabs: [{
      name: '推荐',
      type: 'all'
    }, {
      name: '校园动态',
      type: 'dynamic'
    }, {
      name: '失物招领',
      type: 'lost'
    }, {
      name: '校园活动',
      type: 'activity'
    }],
    active: 0,
    posts: [],
    loading: true,
    error: '',
    keyword: '',
    school: '我的大学',
    hasMore: false,
    page: 1
  },
  onLoad() {
    const user = wx.getStorageSync('userInfo');
    if (user && user.school) this.setData({
      school: user.school
    })
  },
  onShow() {
    ui.syncTab(this, 0);
    const user = wx.getStorageSync('userInfo') || {};
    this.setData({
      school: user.school || '我的大学'
    });
    this.load()
  },
  async load(more = false) {
    more = more === true;
    if (more && this.data.loading) return;
    this.setData({
      loading: true,
      error: ''
    });
    try {
      const page = more ? this.data.page + 1 : 1;
      const result = await api.getPostList({
        type: this.data.active === 0 ? 'dynamic,activity,lost' : this.data.tabs[this.data
          .active].type,
        page,
        pageSize: 5
      });
      this.setData({
        posts: more ? this.data.posts.concat(result.list) : result.list,
        hasMore: result.hasMore,
        page
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
  onReachBottom() {
    if (this.data.hasMore) this.load(true)
  },
  changeTab(e) {
    this.setData({
      active: Number(e.currentTarget.dataset.index)
    });
    this.load()
  },
  onPostChange(e) {
    const changed = e.detail.post
    this.setData({ posts: this.data.posts.map(post => post.id === changed.id ? changed : post) })
  },
  openPost: ui.openPost,
  input(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search() {
    wx.navigateTo({
      url: '/pages/explore/explore?keyword=' + encodeURIComponent(this.data.keyword)
    })
  },
  openCategory(e) {
    ui.list(e.currentTarget.dataset.type, e.currentTarget.dataset.title)
  },
  openActivity() {
    ui.openPost({
      detail: {
        id: 'p2'
      }
    })
  },
  publish() {
    ui.compose('dynamic')
  },
  chooseSchool() {
    wx.showModal({
      title: '选择你的学校',
      editable: true,
      placeholderText: '输入学校名称',
      content: this.data.school === '我的大学' ? '' : this.data.school,
      success: r => {
        if (r.confirm && r.content.trim()) {
          const school = r.content.trim().slice(0, 24);
          const user = wx.getStorageSync('userInfo') || {};
          wx.setStorageSync('userInfo', Object.assign({}, user, {
            school
          }));
          this.setData({
            school
          })
        }
      }
    })
  },
  messages() {
    wx.navigateTo({
      url: '/pages/help/help?mode=messages'
    })
  }
})
