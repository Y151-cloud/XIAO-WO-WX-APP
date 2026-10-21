const req = require('../../utils/request'),
  ui = require('../../utils/ui')
Page({
  data: {
    votes: [],
    loading: true,
    error: '',
    busy: false
  },
  onLoad() {
    this.load()
  },
  async load() {
    try {
      const votes = await req.get('/api/v1/votes');
      votes.forEach(v => v.options.forEach(o => {
        o.percent = Math.round(o.count / v.total * 100)
      }));
      this.setData({
        votes,
        error: ''
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
  async vote(e) {
    if (this.data.busy) return;
    this.setData({
      busy: true
    });
    try {
      await req.post('/api/v1/vote', {
        id: e.currentTarget.dataset.id,
        optionId: e.currentTarget.dataset.option
      });
      await this.load();
      wx.showToast({
        title: '投票成功',
        icon: 'success'
      })
    } catch (e) {
      ui.error(e)
    } finally {
      this.setData({
        busy: false
      })
    }
  }
})
