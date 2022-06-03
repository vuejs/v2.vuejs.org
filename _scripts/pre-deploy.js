// udpate to latest built files of Vue
require('./sync-sponsors')

const fs = require('fs')
const zlib = require('zlib')
const axios = require('axios')
const execSync = require('child_process').execSync

const themeconfPath = 'themes/vue/_config.yml'
const installPath = 'src/v2/guide/installation.md'
const themeconfig = fs.readFileSync(themeconfPath, 'utf-8')
const installation = fs.readFileSync(installPath, 'utf-8')

// get latest Vue version
console.log(`Checking latest Vue version...`)
const localVersion = themeconfig.match(/vue_version: (.*)/)[1]
const version = execSync('npm view vue@v2-latest version').toString().trim()

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
Promise.all([download(`vue.js`), download(`vue.min.js`)])
  .then(([devSize, prodSize]) => {
    // replace installation page version and size
    fs.writeFileSync(
      installPath,
      installation
        .replace(/vue_version: .*/, 'vue_version: ' + version)
        .replace(/gz_size:.*/g, `gz_size: "${prodSize}"`)
        .replace(/\/vue@[\d\.]+/g, `/vue@${version}`)
    )
    console.log(
      `\nSuccessfully updated Vue version (${version}) and gzip file size (${prodSize}kb).\n`
    )
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

function download(file) {
  return axios({
    url: `http://unpkg.com/vue@${version}/dist/${file}`,
    method: 'get'
  }).then((res) => {
    fs.writeFileSync(`themes/vue/source/js/${file}`, res.data)
    const zipped = zlib.gzipSync(Buffer.from(res.data))
    return (zipped.length / 1024).toFixed(2)
  })
}
