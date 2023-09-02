import { rollup } from 'rollup';
import typescript from "@rollup/plugin-typescript";
import {access, readdir, readFile, writeFile} from 'fs/promises'
import { accessSync, constants } from 'fs'
import { join, parse } from "path";
import autoExports from 'rollup-plugin-auto-exports'
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import clear from 'rollup-plugin-clear'
import sizes from 'rollup-plugin-sizes'
import {input as integrationsInput, manifest} from './prepare-integrations.js'
import {input as setupsInput} from './prepare-setups.js'

const inputOptions = {
  input: integrationsInput,
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ['exports/integrations']
    }),
    typescript({
      "compilerOptions": {
        "target": "ESNext",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "declaration": true,
        "experimentalDecorators": true,
        "useDefineForClassFields": false,
        "outDir": "exports/integrations",
        "allowJs": true,
        "types": [
          "node"
        ]
      },
      "exclude": ["examples"]
    }),
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs(),
    autoExports({
      defaultExports: {
        './manifest.js': {
          "import": "./exports/manifest.js",
          "types": "./exports/manifest.d.ts"
        }
      }
    }),
    sizes()
  ]
}

const setupInputOptions = {
  input: setupsInput,
  plugins: [
    clear({
      // required, point out which directories should be clear.
      targets: ['exports/setups']
    }),
    typescript({
      "compilerOptions": {
        "target": "ESNext",
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "declaration": false,
        "experimentalDecorators": true,
        "useDefineForClassFields": false,
        "outDir": "exports/setups",
        "allowJs": true,
        "types": [
          "node"
        ]
      },
      "exclude": ["examples"]
    }),
    nodeResolve({
      preferBuiltins: true
    }),
    commonjs(),
    sizes()
  ]
}

// you can create multiple outputs from the same input to generate e.g.
// different formats like CommonJS and ESM

async function build(inputOptions) {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    bundle = await rollup(inputOptions);

    await generateOutputs(bundle);
  } catch (error) {
    buildFailed = true;
    // do some error reporting
    console.error(error);
  }
  if (bundle) {
    // closes the bundle
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

async function buildSetups(inputOptions) {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    bundle = await rollup(inputOptions);

    await generateSetupOutputs(bundle);
  } catch (error) {
    buildFailed = true;
    // do some error reporting
    console.error(error);
  }
  if (bundle) {
    // closes the bundle
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

async function generateSetupOutputs(bundle) {
  await bundle.write({ format: 'es', dir: 'exports/setups'});
}

async function generateOutputs(bundle) {
  const { output } = await bundle.write({ format: 'es', dir: 'exports/integrations'});
  await writeFile('exports/manifest.js', `export default {${Object.entries(manifest).map((item) => 
  `
  '${item[0]}': {
    ${Object.entries(item[1]).map((item, i) => `${i !== 0  ? '\n\t\t' : ''}'${item[0]}': ${typeof item[1] === 'string' ? `'${item[1]}'`: item[1]}`)}
  }`
  )}
}`)

  await writeFile('./exports/manifest.d.ts', `declare const _default: {
  [index: string]: {
    import: string;
    hasSetup: boolean;
    hasIcon: boolean;
  };
};
export default _default;`)

}

build(inputOptions)
// buildSetups(setupInputOptions)
