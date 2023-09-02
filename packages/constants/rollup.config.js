import typescript from "@rollup/plugin-typescript";
import autoExports from 'rollup-plugin-auto-exports'

export default [{
  input: ['./src/constants.ts'],
  output: [{
    dir: 'exports',
    format: 'es'
  }],
  plugins: [
    autoExports({
      defaultExports: {
        '.': {
          import: './exports/constants.js',
          types: './exports/constants.d.ts'
        }
      }
    }),
    typescript()
  ]
}]