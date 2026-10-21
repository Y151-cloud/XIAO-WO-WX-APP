const seed = require('./data')
const KEY = 'xiaowo_mock_v1'
const clone = value => JSON.parse(JSON.stringify(value))

function load() {
  return wx.getStorageSync(KEY) || {
    posts: clone(seed.posts),
    comments: clone(seed.comments),
    votes: clone(seed.votes),
    likes: [],
    favorites: [],
    joined: [],
    voted: {},
    orders: [],
    songs: [],
    feedback: [],
    history: []
  }
}

function save(db) {
  wx.setStorageSync(KEY, db)
}

function profile() {
  return Object.assign({
    nickName: '小窝同学',
    avatarUrl: '/static/art/avatar.png',
    school: '我的大学',
    signature: '认真生活，也收集快乐',
    role: 'user'
  }, wx.getStorageSync('userInfo') || {})
}

function decorate(db, p) {
  return Object.assign({}, p, {
    images: (p.images || []).map(image => /^(\/|wxfile:|https?:|http:)/.test(image) ? image :
      '/static/art/' + image + '.png'),
    liked: db.likes.indexOf(p.id) > -1,
    collected: db.favorites.indexOf(p.id) > -1,
    joined: db.joined.indexOf(p.id) > -1
  })
}

function handle(options) {
  const db = load(),
    url = options.url,
    method = (options.method || 'GET').toUpperCase(),
    data = options.data || {}
  if (url === '/api/v1/post' && method === 'GET') {
    let list = db.posts.slice();
    const q = (data.keyword || '').trim().toLowerCase()
    if (data.type && data.type !== 'all') list = list.filter(p => data.type.split(',').indexOf(p
      .type) > -1)
    if (data.joined) list = list.filter(p => db.joined.indexOf(p.id) > -1)
    if (data.mine) list = list.filter(p => p.isMine)
    if (data.favorite) list = list.filter(p => db.favorites.indexOf(p.id) > -1)
    if (data.history) list = db.history.map(id => db.posts.find(p => p.id === id)).filter(Boolean)
    if (q) list = list.filter(p => (p.title + p.content + p.tag + p.author).toLowerCase().indexOf(
      q) > -1)
    if (data.sort === 'hot') list.sort((a, b) => b.likes - a.likes)
    if (data.sort === 'price') list.sort((a, b) => (a.price || 0) - (b.price || 0))
    const page = Number(data.page) || 1,
      size = Number(data.pageSize) || 10
    return {
      list: list.slice((page - 1) * size, page * size).map(p => decorate(db, p)),
      total: list.length,
      hasMore: page * size < list.length
    }
  }
  if (url === '/api/v1/post' && method === 'POST') {
    if (!String(data.title || '').trim() || !String(data.content || '').trim()) throw new Error(
      '请填写标题和内容')
    const me = profile(),
      p = Object.assign({}, data, {
        id: 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        author: data.anonymous ? '匿名的窝友' : me.nickName,
        avatar: data.anonymous ? '窝' : (me.nickName || '窝').slice(0, 1),
        tone: 'orange',
        time: '刚刚',
        location: data.location || me.school || '校园',
        likes: 0,
        comments: 0,
        views: 0,
        isMine: true
      })
    db.posts.unshift(p);
    save(db);
    return decorate(db, p)
  }
  const postMatch = url.match(/^\/api\/v1\/post\/([^/]+)$/)
  if (postMatch) {
    const p = db.posts.find(p => p.id === postMatch[1]);
    if (!p) throw new Error('这条内容已不存在')
    if (method === 'DELETE') {
      if (!p.isMine) throw new Error('只能删除自己发布的内容');
      db.posts = db.posts.filter(x => x.id !== p.id);
      db.comments = db.comments.filter(c => c.postId !== p.id);
      ['likes', 'favorites', 'joined', 'history'].forEach(key => {
        db[key] = db[key].filter(id => id !== p.id)
      });
      save(db);
      return true
    }
    if (method === 'GET') {
      p.views++;
      db.history = [p.id].concat(db.history.filter(id => id !== p.id)).slice(0, 50);
      save(db);
      return decorate(db, p)
    }
  }
  if (url.indexOf('/api/v1/interaction/') === 0) {
    const id = data.postId || data.targetId,
      p = db.posts.find(p => p.id === id);
    if (!p) throw new Error('内容不存在')
    const isLike = url.indexOf('/like') > -1,
      key = isLike ? 'likes' : 'favorites'
    if (url.endsWith('/status')) return db[key].indexOf(id) > -1
    if (method === 'DELETE') {
      const existed = db[key].indexOf(id) > -1;
      db[key] = db[key].filter(x => x !== id);
      if (isLike && existed) p.likes = Math.max(0, p.likes - 1)
    } else if (db[key].indexOf(id) === -1) {
      db[key].push(id);
      if (isLike) p.likes++
    }
    save(db);
    return decorate(db, p)
  }
  if (url === '/api/v1/comments') {
    if (method === 'GET') return db.comments.filter(c => c.postId === data.postId)
    const p = db.posts.find(p => p.id === data.postId);
    if (!p) throw new Error('内容不存在')
    const text = String(data.content || '').trim();
    if (!text) throw new Error('写点什么再发送吧')
    const me = profile(),
      c = {
        id: 'c' + Date.now(),
        postId: p.id,
        author: me.nickName,
        avatar: me.nickName.slice(0, 1),
        content: text,
        time: '刚刚'
      }
    db.comments.push(c);
    p.comments++;
    save(db);
    return c
  }
  if (url === '/api/v1/join') {
    const activity = db.posts.find(p => p.id === data.postId);
    if (!activity || activity.type !== 'activity') throw new Error('这不是有效的校园活动');
    if (db.joined.indexOf(data.postId) === -1) db.joined.push(data.postId);
    save(db);
    return true
  }
  if (url === '/api/v1/profile') return profile()
  if (url === '/api/v1/stats') return {
    publish: db.posts.filter(p => p.isMine).length,
    favorite: db.favorites.length,
    joined: db.joined.length,
    orders: db.orders.length
  }
  if (url === '/api/v1/votes') return db.votes.map(v => Object.assign({}, v, {
    selected: db.voted[v.id] || ''
  }))
  if (url === '/api/v1/vote' && method === 'POST') {
    if (db.voted[data.id]) throw new Error('你已经投过票啦')
    const v = db.votes.find(v => v.id === data.id),
      option = v && v.options.find(o => o.id === data.optionId)
    if (!option) throw new Error('请选择一个选项');
    option.count++;
    v.total++;
    db.voted[v.id] = option.id;
    save(db);
    return true
  }
  if (['/api/v1/orders', '/api/v1/songs', '/api/v1/feedback'].indexOf(url) > -1) {
    const key = url.split('/').pop();
    if (method === 'GET') return db[key]
    const item = Object.assign({}, data, {
      id: key + '-' + Date.now(),
      time: '刚刚',
      status: '已提交'
    });
    db[key].unshift(item);
    save(db);
    return item
  }
  throw new Error('该功能暂未接入模拟接口')
}

function request(options) {
  return new Promise((resolve, reject) => setTimeout(() => {
    try {
      resolve(handle(options))
    } catch (e) {
      reject(e)
    }
  }, require('../config/env').mockDelay))
}
module.exports = {
  request,
  handle
}
