var fs = require('fs')
var zlib = require('zlib')
var version = require('../vue/package.json').version
var themeconfPath = 'themes/vue/_config.yml'
var installPath = 'src/v2/guide/installation.md'
var themeconfig = fs.readFileSync(themeconfPath, 'utf-8')
var installation = fs.readFileSync(installPath, 'utf-8')

fs.writeFileSync(
  themeconfPath,
  themeconfig.replace(/vue_version: .*/, 'vue_version: ' + version)
)

var sizes = {
  dev: 'vue.js',
  min: 'vue.min.js',
  gz: 'vue.min.js',
  ro_gz: 'vue.runtime.min.js'
}

var pending = []
Object.keys(sizes).forEach(file => {
  var filesize = fs.statSync('../vue/dist/' + sizes[file], 'utf-8').size
  if (!/gz$/.test(file)) {
    sizes[file] = (filesize / 1024).toFixed(2)
  } else {
    pending.push(new Promise((resolve, reject) => {
      fs.readFile('../vue/dist/' + sizes[file], (err, buf) => {
        if (err) return reject(err)
        zlib.gzip(buf, (err, buf) => {
          if (err) return reject(err)
          sizes[file] = (buf.length / 1024).toFixed(2)
          resolve()
        })
      })
    }))
  }
})

Promise.all(pending).then(() => {
  fs.writeFileSync(
    installPath,
    installation
      .replace(/vue_version: .*/, 'vue_version: ' + version)
      .replace(/(\w+)_size:.*/g, function (m, p1) {
        return p1 + '_size: "' + sizes[p1] + '"'
      })
  )
  console.log(sizes)
}).catch(err => {
  console.error(err)
})
