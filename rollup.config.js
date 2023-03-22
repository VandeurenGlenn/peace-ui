import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import {readdir} from 'fs/promises'
import rimraf from 'rimraf'

rimraf.sync('www/*.js')

const views = (await readdir('./src/www/views')).map(view => `./src/www/views/${view}`)
const themes = (await readdir('./src/www/themes')).map(theme => `./src/www/themes/${theme}`)
const folders = (await readdir('./src/server/integrations'))
let integrations = []

for (const folder of folders) {
  const content = await readdir(`./src/server/integrations/${folder}`)
  console.log(content.map(integration => `./src/server/integrations/${folder}/${integration}`));
  integrations = [...integrations, ...content.map(integration => `./src/server/integrations/${folder}/${integration}`)]
}


export default [{
  input: ['./src/www/shell.js', './src/www/client.ts', ...views],
  output: [{
    dir: 'www',
    format: 'es'
  }],
  plugins: [
    typescript({ compilerOptions: { outDir: './www' }}),
    nodeResolve()
  ]
}, {
  input: themes,
  output: [{
    dir: 'www/themes',
    format: 'es'
  }]
}, {
  input: ['./src/server/server.ts'],
  output: [{
    dir: 'server',
    format: 'es'
  }],
  plugins: [
    typescript({ compilerOptions: { outDir: './server' }})
  ]
}, {
  input: [...integrations],
  output: [{
    dir: 'server/integrations',
    format: 'es'
  }],
  plugins: [
    typescript({ compilerOptions: { outDir: './server/integrations' }})
  ]
}]