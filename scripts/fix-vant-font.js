const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')
const fontDir = path.join(root, 'static', 'fonts')
// Local-only font repair: never downloads dependencies or assets.
for (const extension of ['woff2', 'woff']) {
  const target = path.join(fontDir, `vant-icon.${extension}`)
  if (!fs.existsSync(target)) {
    console.warn(`[font] Missing bundled font: ${target}`)
  }
}
for (const relative of ['node_modules/@vant/weapp/dist/icon/index.wxss', 'miniprogram_npm/@vant/weapp/icon/index.wxss', 'vant/icon/index.wxss']) {
  const filename = path.join(root, relative)
  if (!fs.existsSync(filename)) continue
  const source = fs.readFileSync(filename, 'utf8')
  fs.writeFileSync(filename, source.replace(/@font-face\s*\{[^}]*\}/g, ''), 'utf8')
}
console.log('[font] Offline font repair complete; the bundled font is embedded in app.wxss.')
