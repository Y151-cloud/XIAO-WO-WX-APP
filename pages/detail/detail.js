const req = require('../../utils/request'),
  api = require('../../api/post'),
  interaction = require('../../api/interaction'),
  ui = require('../../utils/ui')
Page({
  data: {
    post: null,
    comments: [],
    comment: '',
    loading: true,
    error: '',
    sending: false,
    actionBusy: false
  },
  onLoad(o) {
    this.id = o.id;
    this.load()
  },
  async load() {
    this.setData({
      loading: true,
      error: ''
    });
    try {
      const post = await api.getPost(this.id),
        comments = await req.get('/api/v1/comments', {
          postId: this.id
        });
      this.setData({
        post,
        comments
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
  async like() {
    await this.interact('like')
  },
  async collect() {
    await this.interact('collect')
  },
  async interact(kind) {
    if (this.data.actionBusy || !this.data.post) return;
    this.setData({
      actionBusy: true
    });
    try {
      const p = this.data.post,
        remove = kind === 'like' ? p.liked : p.collected;
      const fn = kind === 'like' ? (remove ? interaction.unlike : interaction.like) : (
        remove ? interaction.uncollect : interaction.collect);
      const post = await fn({
        postId: p.id
      });
      this.setData({
        post
      });
      if (kind === 'collect') wx.showToast({
        title: post.collected ? '已放进收藏夹' : '已取消收藏',
        icon: 'none'
      })
    } catch (e) {
      ui.error(e)
    } finally {
      this.setData({
        actionBusy: false
      })
    }
  },
  input(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  async send() {
    if (this.data.sending || !this.data.comment.trim()) return;
    this.setData({
      sending: true
    });
    try {
      const c = await req.post('/api/v1/comments', {
        postId: this.id,
        content: this.data.comment.trim()
      });
      this.setData({
        comments: this.data.comments.concat(c),
        comment: '',
        'post.comments': this.data.post.comments + 1
      });
      wx.showToast({
        title: '评论已发送',
        icon: 'success'
      })
    } catch (e) {
      ui.error(e)
    } finally {
      this.setData({
        sending: false
      })
    }
  },
  preview(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.post.images
    })
  },
  async join() {
    if (this.data.actionBusy) return;
    if (this.data.post.joined) {
      wx.showToast({
        title: '你已经报名啦，活动现场见',
        icon: 'none'
      });
      return
    }
    this.setData({
      actionBusy: true
    });
    try {
      await req.post('/api/v1/join', {
        postId: this.id
      });
      this.setData({
        'post.joined': true
      });
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      })
    } catch (e) {
      ui.error(e)
    } finally {
      this.setData({
        actionBusy: false
      })
    }
  },
  contact() {
    wx.navigateTo({
      url: '/pages/help/help?mode=chat&postId=' + this.id
    })
  },
  remove() {
    wx.showModal({
      title: '删除这条发布？',
      content: '删除后将无法在小窝中找回。',
      success: async r => {
        if (r.confirm) {
          try {
            await api.deletePost(this.id);
            wx.navigateBack()
          } catch (e) {
            ui.error(e)
          }
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.post ? this.data.post.title : '来校窝发现校园里的美好',
      path: '/pages/detail/detail?id=' + this.id
    }
  }
})
