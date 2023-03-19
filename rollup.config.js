import nodeResolve from "@rollup/plugin-node-resolve";
import {readdir} from 'fs/promises'
import rimraf from 'rimraf'

rimraf.sync('www/*.js')

const views = (await readdir('./src/www/views')).map(view => `./src/www/views/${view}`)
const themes = (await readdir('./src/www/themes')).map(theme => `./src/www/themes/${theme}`)
const integrations = (await readdir('./src/integrations')).map(integration => `./src/integrations/${integration}`)

export default [{
  input: ['./src/www/shell.js', ...views],
  output: [{
    dir: 'www',
    format: 'es'
  }],
  plugins: [
    nodeResolve()
  ]
}, {
  input: themes,
  output: [{
    dir: 'www/themes',
    format: 'es'
  }]
}, {
  input: integrations,
  output: [{
    dir: 'server/integrations',
    format: 'es'
  }]
}]