import typescript from "@rollup/plugin-typescript";
import autoExports from 'rollup-plugin-auto-exports'

export default [{
  input: './src/utils.ts',
  output: [{
    dir: 'exports',
    format: 'es'
  }],
  plugins: [
    typescript(),

    autoExports({
      defaultExports: {
        ".": {
          import: './exports/utils.js',
          types: './exports/utils.d.ts'
        }
      }
    })
  ]
}]