import { accessSync } from "fs"
import { readdir } from "fs/promises"
import { join, parse } from "path"

let sources = (await readdir('./src'))
  .filter(dir => parse(dir).ext.length === 0)
  .map(async dir => {
    const files = (await readdir(join('./src', dir)))
    return { files, dir }
  })

sources = await Promise.all(sources)

sources = sources.map(source => ({
  integration: source.dir,
  hasSetup: Boolean(source.files.filter(file => file === `setup.ts`)[0])
}))

const input = []
for (const {integration, hasSetup} of sources) {
  if (hasSetup) input.push(join('src', integration, `setup.ts`))
}

export {input}