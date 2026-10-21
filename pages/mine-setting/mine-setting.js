const ui = require('../../utils/ui')
Page({
  data: {
    notification: true
  },
  onLoad() {
    this.setData({
      notification: wx.getStorageSync('xiaowo_notifications') !== false
    })
  },
  toggle() {
    const notification = !this.data.notification;
    wx.setStorageSync('xiaowo_notifications', notification);
    this.setData({
      notification
    })
  },
  profile() {
    wx.navigateTo({
      url: '/pages/mine-profile/mine-profile'
    })
  },
  privacy() {
    wx.showModal({
      title: '本地体验与隐私',
      content: '当前版本的数据仅保存在这台设备。未连接服务器，不会上传你的资料、发布或会话内容。',
      showCancel: false
    })
  },
  feedback() {
    wx.navigateTo({
      url: '/pages/help/help?mode=feedback'
    })
  },
  about() {
    wx.navigateTo({
      url: '/pages/help/help?mode=about'
    })
  },
  reset() {
    wx.showModal({
      title: '重置演示内容？',
      content: '将清除本机发布、收藏、评论、投票、服务和会话记录，恢复最初的示例内容。个人资料会保留。',
      confirmColor: '#d78557',
      success: r => {
        if (r.confirm) {
          wx.removeStorageSync('xiaowo_mock_v1');
          wx.removeStorageSync('xiaowo_draft');
          const keys = wx.getStorageInfoSync().keys;
          keys.filter(k => k.indexOf('xiaowo_chat_') === 0).forEach(k => wx
            .removeStorageSync(k));
          wx.showToast({
            title: '已恢复示例内容',
            icon: 'success'
          })
        }
      }
    })
  }
})
