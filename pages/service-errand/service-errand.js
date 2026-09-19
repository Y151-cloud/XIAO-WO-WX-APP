var getPostList = require('../../api/post').getPostList
var createPost = require('../../api/post').createPost

Page({
  data: {
    showForm: false,
    form: {
      title: '',
      content: '',
      reward: '',
      contact: '',
      deadline: ''
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
    var title = this.data.form.title
    var content = this.data.form.content
    if (!title.trim()) {
      wx.showToast({ title: '请填写标题', icon: 'none' })
      return
    }
    if (!content.trim()) {
      wx.showToast({ title: '请填写需求描述', icon: 'none' })
      return
    }
    this.setData({ submitting: true })
    createPost({
      title: this.data.form.title,
      content: this.data.form.content,
      reward: this.data.form.reward,
      contact: this.data.form.contact,
      deadline: this.data.form.deadline,
      type: 'ERRAND',
      tag: '跑腿'
    }).then(function() {
      wx.showToast({ title: '发布成功', icon: 'success' })
      that.setData({
        showForm: false,
        form: { title: '', content: '', reward: '', contact: '', deadline: '' }
      })
      that.resetAndLoad()
    }).catch(function() {
      wx.showToast({ title: '发布失败', icon: 'none' })
    }).finally(function() {
      that.setData({ submitting: false })
    })
  },

  loadList: function() {
    var that = this
    if (this.data.finished || this.data.loading) return
    this.setData({ loading: true })
    getPostList({ page: this.data.page, size: 10, type: 'ERRAND' }).then(function(res) {
      var records = res.records || res.list || res || []
      that.setData({
        list: that.data.page === 1 ? records : that.data.list.concat(records),
        page: that.data.page + 1,
        finished: records.length < 10
      })
    }).catch(function(err) {
      console.error('加载跑腿列表失败', err)
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