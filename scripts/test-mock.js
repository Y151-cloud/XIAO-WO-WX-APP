const assert = require('node:assert/strict')
const storage = new Map()
const copy = value => value === undefined ? '' : JSON.parse(JSON.stringify(value))
global.wx = {
  getStorageSync: key => copy(storage.get(key)),
  setStorageSync: (key, value) => storage.set(key, copy(value)),
  removeStorageSync: key => storage.delete(key),
  request: () => {
    throw new Error('Mock mode must never make a network request')
  }
}
const {
  handle
} = require('../mock/index')
const api = require('../api/post')
const get = (url, data) => handle({
  url,
  data
})
const post = (url, data) => handle({
  url,
  data,
  method: 'POST'
})
const del = (url, data) => handle({
  url,
  data,
  method: 'DELETE'
})
let passed = 0

function test(name, fn) {
  fn();
  passed++;
  console.log('PASS ' + name)
}
test('Filtering, search and pagination preserve the full matching set', () => {
  const first = get('/api/v1/post', {
    type: 'dynamic,activity,lost',
    pageSize: 2
  })
  const next = get('/api/v1/post', {
    type: 'dynamic,activity,lost',
    pageSize: 2,
    page: 2
  })
  assert.equal(first.total, 3);
  assert.equal(first.hasMore, true)
  assert.equal(next.list.length, 1);
  assert.equal(next.hasMore, false)
  assert.equal(new Set(first.list.concat(next.list).map(p => p.id)).size, 3)
  assert.equal(get('/api/v1/post', {
    keyword: '银杏'
  }).list[0].id, 'p1')
  assert.equal(get('/api/v1/post', {
    type: 'lost',
    keyword: '银杏'
  }).total, 0)
})
test('Repeated likes and favorites are idempotent and survive storage reads', () => {
  const initial = get('/api/v1/post/p1').likes
  post('/api/v1/interaction/like', {
    postId: 'p1'
  });
  post('/api/v1/interaction/like', {
    postId: 'p1'
  })
  assert.equal(get('/api/v1/post/p1').likes, initial + 1)
  post('/api/v1/interaction/collect', {
    postId: 'p1'
  })
  assert.equal(get('/api/v1/post', {
    favorite: true
  }).list[0].id, 'p1')
  del('/api/v1/interaction/like', {
    postId: 'p1'
  });
  del('/api/v1/interaction/like', {
    postId: 'p1'
  })
  assert.equal(get('/api/v1/post/p1').likes, initial)
  del('/api/v1/interaction/collect', {
    postId: 'p1'
  })
  assert.equal(get('/api/v1/post', {
    favorite: true
  }).total, 0)
})
test('Publication works with a school-only profile and anonymous identity', () => {
  wx.setStorageSync('userInfo', {
    school: '示例大学'
  })
  const created = post('/api/v1/post', {
    type: 'treehole',
    title: '测试标题',
    content: '校园测试内容',
    images: [],
    anonymous: true
  })
  assert.equal(created.author, '匿名的窝友');
  assert.equal(created.location, '示例大学')
  assert.equal(get('/api/v1/post', {
    mine: true
  }).total, 1)
  const comment = post('/api/v1/comments', {
    postId: created.id,
    content: '温暖的回应'
  })
  assert.equal(comment.author, '小窝同学')
  assert.equal(get('/api/v1/post/' + created.id).comments, 1)
  del('/api/v1/post/' + created.id)
  assert.equal(get('/api/v1/post', {
    mine: true
  }).total, 0)
  assert.throws(() => del('/api/v1/post/p1'), /只能删除/)
})
test('Comments are persisted and whitespace-only comments are rejected', () => {
  const count = get('/api/v1/post/p1').comments
  post('/api/v1/comments', {
    postId: 'p1',
    content: '好喜欢校园的秋天'
  })
  assert.equal(get('/api/v1/comments', {
    postId: 'p1'
  }).length, count + 1)
  assert.throws(() => post('/api/v1/comments', {
    postId: 'p1',
    content: '  '
  }), /写点什么/)
})
test('Activity registration is idempotent and visible from the profile', () => {
  post('/api/v1/join', {
    postId: 'p2'
  });
  post('/api/v1/join', {
    postId: 'p2'
  })
  assert.equal(get('/api/v1/stats').joined, 1)
  assert.equal(get('/api/v1/post', {
    joined: true
  }).list[0].id, 'p2')
})
test('Voting changes counts once and rejects invalid or duplicate votes', () => {
  assert.throws(() => post('/api/v1/vote', {
    id: 'v1',
    optionId: 'invalid'
  }), /请选择/)
  const before = get('/api/v1/votes')[0]
  post('/api/v1/vote', {
    id: 'v1',
    optionId: 'a'
  })
  const after = get('/api/v1/votes')[0]
  assert.equal(after.total, before.total + 1);
  assert.equal(after.selected, 'a')
  assert.equal(after.options[0].count, before.options[0].count + 1)
  assert.throws(() => post('/api/v1/vote', {
    id: 'v1',
    optionId: 'b'
  }), /已经投过/)
})
test('Orders, songs and feedback stay in their own local collections', () => {
  post('/api/v1/orders', {
    title: '取快递',
    location: '北门',
    destination: '南区',
    price: 5
  })
  post('/api/v1/songs', {
    title: '晴天',
    content: '送给同学'
  })
  post('/api/v1/feedback', {
    content: '希望增加更多校园活动'
  })
  assert.equal(get('/api/v1/orders').length, 1)
  assert.equal(get('/api/v1/songs').length, 1)
  assert.equal(get('/api/v1/feedback').length, 1)
  assert.equal(get('/api/v1/stats').orders, 1)
})
test('History is deduplicated and asset paths resolve locally', () => {
  get('/api/v1/post/p1');
  get('/api/v1/post/p1')
  const history = get('/api/v1/post', {
    history: true
  }).list
  assert.equal(history.filter(p => p.id === 'p1').length, 1)
  assert.equal(history[0].images[0], '/static/art/campus.png')
});
(async () => {
  const result = await api.getPostList({
    type: 'idle'
  })
  assert.equal(result.total, 3)
  passed++;
  console.log('PASS Existing public API uses Mock transport without network')
  console.log(`${passed} behavior checks passed`)
})().catch(error => {
  console.error(error);
  process.exitCode = 1
})
