function syncTab(page, index) {
  if (typeof page.getTabBar === 'function') {
    const bar = page.getTabBar();
    if (bar) bar.setData({
      active: index
    })
  }
}

function error(err) {
  wx.showToast({
    title: err.message || '请稍后重试',
    icon: 'none'
  })
}

function openPost(e) {
  wx.navigateTo({
    url: '/pages/detail/detail?id=' + encodeURIComponent((e.detail && e.detail.id) || (e
      .currentTarget && e.currentTarget.dataset.id))
  })
}

function compose(type) {
  wx.navigateTo({
    url: '/pages/compose/compose?type=' + encodeURIComponent(type || 'dynamic')
  })
}

function list(type, title) {
  wx.navigateTo({
    url: '/pages/explore/explore?type=' + encodeURIComponent(type || 'all') + '&title=' +
      encodeURIComponent(title || '校园发现')
  })
}
function decodeQuery(value) {
  try {
    return decodeURIComponent(value || '')
  } catch (e) {
    return value || ''
  }
}

module.exports = {
  decodeQuery,
  syncTab,
  error,
  openPost,
  compose,
  list
}
