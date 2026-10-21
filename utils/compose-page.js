const req = require('./request'),
  api = require('../api/post'),
  ui = require('./ui')
const types = [{
  value: 'dynamic',
  name: '校园动态'
}, {
  value: 'lost',
  name: '失物招领'
}, {
  value: 'activity',
  name: '校园活动'
}, {
  value: 'confession',
  name: '表白墙'
}, {
  value: 'treehole',
  name: '小小树洞'
}, {
  value: 'forum',
  name: '校园论坛'
}, {
  value: 'idle',
  name: '闲置交易'
}, {
  value: 'buy',
  name: '求购专区'
}, {
  value: 'inherit',
  name: '毕业传承'
}, {
  value: 'carpool',
  name: '拼车拼团'
}]
module.exports = function(defaultType) {
  return {
    data: {
      types,
      type: 'dynamic',
      typeIndex: 0,
      title: '',
      content: '',
      location: '',
      destination: '',
      price: '',
      contact: '',
      images: [],
      anonymous: false,
      saving: false,
      submitted: false,
      submittedTitle: '',
      isGoods: false,
      isErrand: false,
      isSong: false,
      isActivity: false
    },
    onLoad(o) {
      this.updateType(o.type || defaultType || 'dynamic');
      if (!defaultType) {
        const draft = wx.getStorageSync('xiaowo_draft');
        if (draft && draft.type === this.data.type) this.setData(draft)
      }
    },
    updateType(type) {
      const i = types.findIndex(t => t.value === type);
      this.setData({
        type,
        typeIndex: Math.max(i, 0),
        isGoods: ['idle', 'buy', 'inherit'].indexOf(type) > -1,
        isErrand: type === 'errand',
        isSong: type === 'song',
        isActivity: type === 'activity'
      });
      wx.setNavigationBarTitle({
        title: type === 'errand' ? '发布跑腿需求' : type === 'song' ? '点一首歌' : '分享校园生活'
      })
    },
    changeType(e) {
      this.updateType(types[Number(e.detail.value)].value)
    },
    field(e) {
      this.setData({
        [e.currentTarget.dataset.field]: e.detail.value
      })
    },
    toggleAnonymous() {
      this.setData({
        anonymous: !this.data.anonymous
      })
    },
    chooseImages() {
      wx.chooseMedia({
        count: 3 - this.data.images.length,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: async r => {
          try {
            const paths = await Promise.all(r.tempFiles.map(f => new Promise((resolve,
              reject) => wx.getFileSystemManager().saveFile({
              tempFilePath: f.tempFilePath,
              success: s => resolve(s.savedFilePath),
              fail: reject
            }))));
            this.setData({
              images: this.data.images.concat(paths)
            })
          } catch (e) {
            wx.showToast({
              title: '图片保存失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    },
    removeImage(e) {
      this.setData({
        images: this.data.images.filter((_, i) => i !== Number(e.currentTarget.dataset.index))
      })
    },
    saveDraft() {
      const d = this.data;
      wx.setStorageSync('xiaowo_draft', {
        type: d.type,
        title: d.title,
        content: d.content,
        location: d.location,
        price: d.price,
        images: d.images,
        anonymous: d.anonymous
      });
      wx.showToast({
        title: '草稿已保存在本机',
        icon: 'none'
      })
    },
    async submit() {
      if (this.data.saving) return;
      const d = this.data,
        title = d.title.trim(),
        content = d.content.trim();
      if (!title || !content) {
        wx.showToast({
          title: d.isSong ? '请填写歌曲和想说的话' : '请填写标题和内容',
          icon: 'none'
        });
        return
      }
      if (d.isGoods && (!d.price || !Number.isFinite(Number(d.price)) || Number(d.price) <=
        0)) {
        wx.showToast({
          title: '请填写有效的价格',
          icon: 'none'
        });
        return
      }
      if (d.isErrand && (!d.location.trim() || !d.destination.trim() || !d.contact.trim())) {
        wx.showToast({
          title: '请补全取件点、送达点和联系方式',
          icon: 'none'
        });
        return
      }
      if (d.isErrand && (!d.price || !Number.isFinite(Number(d.price)) || Number(d.price) <=
        0)) {
        wx.showToast({
          title: '请填写有效的跑腿酬金',
          icon: 'none'
        });
        return
      }
      this.setData({
        saving: true
      });
      try {
        let result;
        const payload = {
          title,
          content,
          location: d.location.trim(),
          destination: d.destination.trim(),
          contact: d.contact.trim(),
          price: Number(d.price) || 0
        };
        if (d.isErrand) result = await req.post('/api/v1/orders', payload);
        else if (d.isSong) result = await req.post('/api/v1/songs', payload);
        else {
          payload.type = d.type;
          payload.images = d.images;
          payload.anonymous = d.anonymous;
          payload.tag = types[d.typeIndex].name;
          result = await api.createPost(payload);
          wx.removeStorageSync('xiaowo_draft')
        }
        this.result = result;
        this.setData({
          submitted: true,
          submittedTitle: d.isErrand ? '需求已记录' : d.isSong ? '你的心意，已经收好' : '发布成功，小窝又多了一份美好'
        })
      } catch (e) {
        ui.error(e)
      } finally {
        this.setData({
          saving: false
        })
      }
    },
    viewResult() {
      if (this.data.isErrand) wx.redirectTo({
        url: '/pages/help/help?mode=orders'
      });
      else if (this.data.isSong) wx.redirectTo({
        url: '/pages/help/help?mode=songs'
      });
      else wx.redirectTo({
        url: '/pages/detail/detail?id=' + this.result.id
      })
    },
    backHome() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
