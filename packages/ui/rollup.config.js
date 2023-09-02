import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy'
import materialSymbols from 'rollup-plugin-material-symbols'

import materialSymbols2 from 'rollup-plugin-material-symbols'
import {readdir} from 'fs/promises'
// import rimraf from 'rimraf'

// rimraf.sync('www/*.js')

const views = (await readdir('./src/views')).map(view => `./src/views/${view}`)

export default [{
  input: ['./src/shell.ts', './src/client.ts', ...views],
  output: [{
    dir: 'www',
    format: 'es'
  }],
  plugins: [
    clear({
      targets: 'www'
    }),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'www' },
        { src: './../../node_modules/@vandeurenglenn/lit-elements/exports/themes', dest: 'www' },
        { src: './../assets/**/*.png', dest: 'www/assets' }
      ]
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    nodeResolve(),
    materialSymbols({
      placeholderPrefix: 'symbol'
    }),
    materialSymbols2({
      placeholderPrefix: 'filledsymbol',
      styling: {
        fill: 1
      }
    })
  ]
}]