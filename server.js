import Koa from 'koa'
import koaStatic from 'koa-static'
import compress from 'koa-compress'
import { LeofcoinStorage, Store } from '@leofcoin/storage'
import socketRequestServer from 'socket-request-server'
const server = new Koa()
const configStore = new LeofcoinStorage('config', '.peace-ui')
await configStore.init()

if (!await configStore.has('integrations')) await configStore.put('integrations', new TextEncoder().encode((JSON.stringify([]))))

const apiServer = await socketRequestServer('peace-api', {
  config: async ({send}) => send((await configStore.get())),
  addIntegration: async (params, {send}) => {
    
    configStore.put('integrations')
  }
})

import NikoHomeControl from './server/integrations/niko-home-control.js'


new NikoHomeControl()
server.use(compress())
server.use(koaStatic('./www'))
server.use((ctx) => {
  ctx.compress = true
  // ctx.set('Content-Type', 'text/plain')
})
server.listen(2020)