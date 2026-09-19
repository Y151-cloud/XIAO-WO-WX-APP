var getPostList = require('../../api/post').getPostList
var createPost = require('../../api/post').createPost

Page({
  data: {
    showForm: false,
    form: {
      songName: '',
      singer: '',
      toUser: '',
      content: ''
    },
    submitting: false,
    list: [],
    page: 1,
    finished: false,
    loading: false,
    refreshing: false
  },

  onLoad: function() {
    this.loadList()
  },

  toggleForm: function() {
    this.setData({ showForm: !this.data.showForm })
  },

  onFormInput: function(e) {
    var field = e.currentTarget.dataset.field
    this.setData({ ['form.' + field]: e.detail })
  },

  onSubmit: function() {
    var that = this
    var songName = this.data.form.songName
    var singer = this.data.form.singer
    var toUser = this.data.form.toUser
    var content = this.data.form.content
    if (!songName.trim()) {
      wx.showToast({ title: '请填写歌曲名', icon: 'none' })
      return
    }
    this.setData({ submitting: true })
    var title = '为' + (toUser || '你') + '点一首《' + songName + '》'
    var desc = '歌曲：' + songName + (singer ? ' - ' + singer : '')
    createPost({
      title: title,
      content: content || desc,
      songName: songName,
      singer: singer,
      toUser: toUser,
      type: 'SONG',
      tag: '点歌'
    }).then(function() {
      wx.showToast({ title: '点歌成功', icon: 'success' })
      that.setData({
        showForm: false,
        form: { songName: '', singer: '', toUser: '', content: '' }
      })
      that.resetAndLoad()
    }).catch(function() {
      wx.showToast({ title: '点歌失败', icon: 'none' })
    }).finally(function() {
      that.setData({ submitting: false })
    })
  },

  loadList: function() {
    var that = this
    if (this.data.finished || this.data.loading) return
    this.setData({ loading: true })
    getPostList({ page: this.data.page, size: 10, type: 'SONG' }).then(function(res) {
      var records = res.records || res.list || res || []
      that.setData({
        list: that.data.page === 1 ? records : that.data.list.concat(records),
        page: that.data.page + 1,
        finished: records.length < 10
      })
    }).catch(function(err) {
      console.error('加载点歌列表失败', err)
    }).finally(function() {
      that.setData({ loading: false, refreshing: false })
    })
  },

  resetAndLoad: function() {
    this.setData({ list: [], page: 1, finished: false })
    this.loadList()
  },

  onRefresh: function() {
    this.setData({ refreshing: true })
    this.resetAndLoad()
  },

  onLoadMore: function() {
    this.loadList()
  },

  onItemTap: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/index-dynamic/index-dynamic?id=' + id })
  }
})