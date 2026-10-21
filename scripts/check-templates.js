const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const root = path.resolve(__dirname, '..')
const candidates = [
  process.env.WECHAT_DEVTOOLS_DIR,
  path.resolve(root, '..', '..', '微信web开发者工具'),
  'C:/Program Files (x86)/Tencent/微信web开发者工具',
  'C:/Program Files/Tencent/微信web开发者工具'
].filter(Boolean)
const toolsDir = candidates.find(dir => fs.existsSync(path.join(dir, 'resources/app.asar.unpacked/node_modules/wcc-exec/wcc.exe')))
if (!toolsDir) {
  console.log('SKIP native WXML/WXSS checks: set WECHAT_DEVTOOLS_DIR to the installed WeChat DevTools directory.')
  process.exit(0)
}
const compilerDir = path.join(toolsDir, 'resources/app.asar.unpacked/node_modules/wcc-exec')
const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xiaowo-templates-'))
const templates = [], styles = ['app.wxss']
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name)
    if (entry.isDirectory()) walk(file)
    else {
      const relative = path.relative(root, file).replace(/\\/g, '/')
      if (/\.(wxml|wxs)$/.test(file)) templates.push(relative)
      if (file.endsWith('.wxss')) styles.push(relative)
    }
  }
}
for (const dir of ['pages', 'components', 'custom-tab-bar', 'vant']) walk(path.join(root, dir))
function compile(binary, files, output) {
  const result = spawnSync(path.join(compilerDir, binary), ['-o', path.join(outputDir, output), ...files], {
    cwd: root, encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`${binary} failed: ${result.stderr || result.stdout}`)
}
compile('wcc.exe', templates, 'wxml.js')
compile('wcsc.exe', styles, 'wxss.js')
console.log(`Native WeChat compiler checks passed: ${templates.filter(f => f.endsWith('.wxml')).length} WXML templates, ${styles.length} WXSS files.`)
