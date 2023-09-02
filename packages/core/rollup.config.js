
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default [{
  input: ['./src/core.ts', './../../node_modules/@leofcoin/storage/exports/store.js'],
  output: [{
    dir: 'exports',
    format: 'es'
  }],
  plugins: [
    copy({
      targets: [
        { src: './../integrations/exports/integrations', dest: './exports'}
      ]
    }),
    typescript()
  ]
}]