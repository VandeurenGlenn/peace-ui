import { accessSync } from "fs"
import { readdir, constants } from "fs/promises"
import { join, parse } from "path"

const manifest = {}

let sources = (await readdir('./src'))
  .filter(dir => parse(dir).ext.length === 0)
  .map(async dir => {
    const files = (await readdir(join('./src', dir)))
    return { files, dir }
  })

sources = await Promise.all(sources)
sources = sources.reduce((set, source) => {
  let hasIcon
  const path = process.env.npm_config_local_prefix ? 
    join(process.env.npm_config_local_prefix, `packages/assets/integrations/${source.dir}.png`) : 
    `./../assets/integrations/${source.dir}.png`
  try {
    accessSync(path, constants.F_OK)
    hasIcon = true
  } catch (error) {
    hasIcon = false
  }
  manifest[source.dir] = {
    import: `./integrations/${source.dir}.js`,
    hasSetup: Boolean(source.files.filter(file => file === `setup.ts`)[0]),
    hasIcon
  }
  set.push(source.dir)
  return set
}, [])

const input = []
for (const integration of sources) {
  input.push(join('src', integration, `${integration}.ts`))
}

export {input, manifest}