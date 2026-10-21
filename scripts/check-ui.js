const fs = require('fs'),
  path = require('path'),
  vm = require('vm'),
  assert = require('assert/strict')
const ROOT = path.resolve(__dirname, '..'),
  store = new Map();
let pageDef
const copy = v => v === undefined ? '' : JSON.parse(JSON.stringify(v))
global.wx = {
  getStorageSync: k => copy(store.get(k)),
  setStorageSync: (k, v) => store.set(k, copy(v)),
  removeStorageSync: k => store.delete(k),
  stopPullDownRefresh() {},
  setNavigationBarTitle() {},
  showToast() {},
  getStorageInfoSync: () => ({
    keys: [...store.keys()]
  })
}
global.Page = o => {
  pageDef = o
}
global.getCurrentPages = () => []
const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'))
let syntaxCount = 0,
  jsonCount = 0

function walk(dir) {
  for (const entry of fs.readdirSync(dir, {
      withFileTypes: true
    })) {
    const f = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(f);
    else if (f.endsWith('.js')) {
      new vm.Script(fs.readFileSync(f, 'utf8'), {
        filename: f
      });
      syntaxCount++
    } else if (f.endsWith('.json')) {
      JSON.parse(fs.readFileSync(f, 'utf8'));
      jsonCount++
    }
  }
}
for (const dir of ['pages', 'components', 'custom-tab-bar', 'mock', 'config', 'utils', 'api']) walk(
  path.join(ROOT, dir))
for (const route of app.pages)
  for (const ext of ['.js', '.json', '.wxml', '.wxss']) assert.ok(fs.existsSync(path.join(ROOT,
    route + ext)), route + ext)

function mount(route, options = {}) {
  pageDef = undefined;
  const entry = path.join(ROOT, route + '.js');
  delete require.cache[require.resolve(entry)];
  require(entry);
  const page = Object.assign({}, pageDef);
  page.data = copy(page.data);
  page.setData = function(patch) {
    for (const [k, value] of Object.entries(patch)) {
      const parts = k.split('.');
      let obj = this.data;
      while (parts.length > 1) {
        const key = parts.shift();
        obj = obj[key] || (obj[key] = {})
      }
      obj[parts[0]] = value
    }
  };
  page.onLoad && page.onLoad(options);
  return page
};
(async () => {
  for (const route of ['pages/index/index', 'pages/community/community', 'pages/market/market',
      'pages/service/service', 'pages/mine/mine', 'pages/explore/explore',
      'pages/detail/detail', 'pages/service-vote/service-vote', 'pages/help/help'
    ]) {
    const p = mount(route, route.includes('/detail') ? {
      id: 'p1'
    } : {});
    if (p.load) await p.load();
    assert.equal(p.data.error || '', '', route)
  }
  const search = mount('pages/explore/explore', {
    keyword: encodeURIComponent('秋天'),
    title: encodeURIComponent('校园发现')
  });
  await search.load();
  assert.equal(search.data.keyword, '秋天');
  assert.equal(search.data.title, '校园发现');
  assert.ok(search.data.posts.some(post => post.title.includes('秋天')));
  const ui = require('../utils/ui');
  assert.equal(ui.decodeQuery('100%努力'), '100%努力');
  assert.equal(ui.decodeQuery('校园动态'), '校园动态');
  const compile = mount('pages/compose/compose', {
    type: 'idle'
  });
  compile.setData({
    title: '校内好物',
    content: '刚刚好需要的物品',
    price: '-1'
  });
  await compile.submit();
  assert.equal(compile.data.submitted, false)
  compile.setData({
    price: '20'
  });
  await compile.submit();
  assert.equal(compile.data.submitted, true)
  const errand = mount('pages/service-errand/service-errand', {});
  errand.setData({
    title: '取快递',
    content: '一件小包裹',
    location: '北门',
    destination: '南区',
    contact: '校内联系',
    price: '5'
  });
  await errand.submit();
  assert.equal(errand.data.submitted, true)
  console.log(`${syntaxCount} JavaScript files and ${jsonCount} JSON files validated`)
  console.log(`${app.pages.length} registered pages have complete files`)
  console.log('12 page loading / form checks passed, including encoded Chinese navigation')
})().catch(e => {
  console.error(e);
  process.exitCode = 1
})
