Component({
  data: {
    active: 0,
    list: [{
      url: '/pages/index/index',
      name: '首页',
      icon: 'home-o',
      selected: 'wap-home'
    }, {
      url: '/pages/community/community',
      name: '社区',
      icon: 'friends-o',
      selected: 'friends'
    }, {
      url: '/pages/market/market',
      name: '集市',
      icon: 'shop-o',
      selected: 'shop'
    }, {
      url: '/pages/service/service',
      name: '服务',
      icon: 'apps-o',
      selected: 'apps-o'
    }, {
      url: '/pages/mine/mine',
      name: '我的',
      icon: 'contact',
      selected: 'contact'
    }]
  },
  methods: {
    onChange(e) {
      const index = Number(e.currentTarget.dataset.index);
      if (index === this.data.active) return;
      wx.switchTab({
        url: this.data.list[index].url
      })
    }
  },
  pageLifetimes: {
    show() {
      const pages = getCurrentPages(),
        p = pages[pages.length - 1];
      if (p) {
        const i = this.data.list.findIndex(x => x.url === '/' + p.route);
        if (i >= 0) this.setData({
          active: i
        })
      }
    }
  }
})
