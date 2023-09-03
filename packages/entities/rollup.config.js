import typescript from "@rollup/plugin-typescript";
import autoExports from 'rollup-plugin-auto-exports'

export default [{
  input: ['./src/entities.ts'],
  output: [{
    dir: 'exports',
    format: 'es'
  }],
  plugins: [
    autoExports({
      defaultExports: {
        '.': {
          import: './exports/entities.js',
          types: './exports/entities.d.ts',
        }
      }
    }),
    typescript()
  ]
}]