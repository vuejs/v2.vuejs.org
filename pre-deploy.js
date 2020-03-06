// update to latest built files of Vue

const fs = require('fs')
const zlib = require('zlib')
const fetch = require('node-fetch')
const execSync = require('child_process').execSync

const themeconfPath = 'themes/vue/_config.yml'
const installPath = 'src/v2/guide/installation.md'
const themeconfig = fs.readFileSync(themeconfPath, 'utf-8')
const installation = fs.readFileSync(installPath, 'utf-8')

// get latest Vue version
console.log(`Checking latest Vue version...`)
const localVersion = themeconfig.match(/vue_version: (.*)/)[1]
const version = execSync('npm view vue version').toString().trim()

if (localVersion === version) {
  console.log(`Version is up-to-date.`)
  process.exit(0)
}

console.log(`Latest version: ${version}. Downloading dist files...`)

// replace version in theme config
fs.writeFileSync(
  themeconfPath,
  themeconfig.replace(/vue_version: .*/, 'vue_version: ' + version)
)

// grab it from unpkg
Promise.all([
  download(`vue.js`),
  download(`vue.min.js`)
]).then(([ devSize, prodSize ]) => {
  // replace installation page version and size
  fs.writeFileSync(
    installPath,
    installation
      .replace(/vue_version: .*/, 'vue_version: ' + version)
      .replace(/gz_size:.*/g, `gz_size: "${prodSize}"`)
      .replace(/\/vue@[\d\.]+/g, `/vue@${version}`)
  )
  console.log(`\nSuccessfully updated Vue version and gzip file size.\n`)
}).catch(err => {
  console.error(err)
  process.exit(1)
})

function download (file) {
  return new Promise((resolve, reject) => {
    fetch(`http://unpkg.com/vue@${version}/dist/${file}`)
      .then(function(res) {
        if (res.status != 200) {
          return reject(
            `unexpected response code when downloading from unpkg: ${res.status}` +
            `\n${res.text()}`
          )
        }
        return res.text()
      })
      .then(function(body) {
        fs.writeFile(`themes/vue/source/js/${file}`, body, err => {
          if (err) return reject(err)
          zlib.gzip(body, (err, zipped) => {
            if (err) return reject(err)
            resolve((zipped.length / 1024).toFixed(2))
          })
        })
      })
      .catch(function(err) {
        return reject(err.statusText)
      })
  })
}
