import Koa from 'koa'
import koaStatic from 'koa-static'

import compress from 'koa-compress'
import { constants } from 'zlib'

export default class UiServer {
  constructor() {

    const ui = new Koa()

    ui.use(compress({
      filter (content_type) {
        return /text|application\/javascript/i.test(content_type)
      },
      threshold: 2048,
      gzip: {
        flush: constants.Z_SYNC_FLUSH
      },
      deflate: {
        flush: constants.Z_SYNC_FLUSH,
      },
      br: false // disable brotli
    }))
    ui.use(koaStatic('./packages/ui/www'))
    ui.listen(8080, () => {
      console.log('listening on 8080');
      
    })
  }
}