// sync latest data from sponsor.vuejs.org
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const yaml = require('js-yaml')

const configPath = path.resolve(__dirname, '../themes/vue/_config.yml')

;(async () => {
  const { data } = await axios(`https://sponsors.vuejs.org/data.json`)
  const yml = yaml.dump(data)
  const config = fs.readFileSync(configPath, 'utf-8')
  const updated = config.replace(
    /(# START SPONSORS)[^]*(# END SPONSORS)/,
    `$1\n${yml}$2`
  )
  fs.writeFileSync(configPath, updated)
})()
