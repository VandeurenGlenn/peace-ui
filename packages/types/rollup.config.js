import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import {readdir} from 'fs/promises'
// import rimraf from 'rimraf'

// rimraf.sync('www/*.js')

const views = (await readdir('./src/www/views')).map(view => `./src/www/views/${view}`)

export default [{
  input: ['./src/types'],
  output: [{
    dir: 'exports',
    format: 'es'
  }],
  plugins: [
    typescript({ compilerOptions: { outDir: './export' }})
  ]
}]