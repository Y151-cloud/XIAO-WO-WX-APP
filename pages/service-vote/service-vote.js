var getPostList = require('../../api/post').getPostList
var createPost = require('../../api/post').createPost

Page({
  data: {
    showForm: false,
    form: {
      title: '',
      content: '',
      options: ['', '']
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

  onOptionInput: function(e) {
    var index = e.currentTarget.dataset.index
    var options = this.data.form.options.slice()
    options[index] = e.detail
    this.setData({ 'form.options': options })
  },

  addOption: function() {
    if (this.data.form.options.length >= 10) {
      wx.showToast({ title: '最多10个选项', icon: 'none' })
      return
    }
    var options = this.data.form.options.concat([''])
    this.setData({ 'form.options': options })
  },

  removeOption: function(e) {
    var index = e.currentTarget.dataset.index
    if (this.data.form.options.length <= 2) {
      wx.showToast({ title: '至少保留2个选项', icon: 'none' })
      return
    }
    var options = this.data.form.options.filter(function(_, i) { return i !== index })
    this.setData({ 'form.options': options })
  },

  onSubmit: function() {
    var that = this
    var title = this.data.form.title
    var content = this.data.form.content
    var options = this.data.form.options
    if (!title.trim()) {
      wx.showToast({ title: '请填写投票标题', icon: 'none' })
      return
    }
    var validOptions = options.filter(function(o) { return o.trim() })
    if (validOptions.length < 2) {
      wx.showToast({ title: '至少填写2个选项', icon: 'none' })
      return
    }
    this.setData({ submitting: true })
    createPost({
      title: title,
      content: content,
      options: validOptions,
      type: 'VOTE',
      tag: '投票'
    }).then(function() {
      wx.showToast({ title: '创建成功', icon: 'success' })
      that.setData({
        showForm: false,
        form: { title: '', content: '', options: ['', ''] }
      })
      that.resetAndLoad()
    }).catch(function() {
      wx.showToast({ title: '创建失败', icon: 'none' })
    }).finally(function() {
      that.setData({ submitting: false })
    })
  },

  loadList: function() {
    var that = this
    if (this.data.finished || this.data.loading) return
    this.setData({ loading: true })
    getPostList({ page: this.data.page, size: 10, type: 'VOTE' }).then(function(res) {
      var records = res.records || res.list || res || []
      that.setData({
        list: that.data.page === 1 ? records : that.data.list.concat(records),
        page: that.data.page + 1,
        finished: records.length < 10
      })
    }).catch(function(err) {
      console.error('加载投票列表失败', err)
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