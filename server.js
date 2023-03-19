import Koa from 'koa'
import koaStatic from 'koa-static'
import compress from 'koa-compress'
import NikoHomeControl from './server/integrations/niko-home-control.js'
const server = new Koa()

new NikoHomeControl()
server.use(compress())
server.use(koaStatic('./www'))
server.use((ctx) => {
  ctx.compress = true
  // ctx.set('Content-Type', 'text/plain')
})
server.listen(2020)