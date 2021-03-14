const dayjs = require('dayjs')
const fs = require('fs')

module.exports = options => {
  return async (ctx, next) => {
    const nowDate = Date.now() // 等同于new Date().getTime()
    const req = ctx.request;
    await next();
    if (ctx.websocket) {
      return
    }
    const res = ctx.response.body
    const log = {
      method: req.method,
      url: req.url,
      data: req.body,
      response: {
        code: res.code,
        message: res.message
      },
      timeLength: Date.now() - nowDate
    }

    const data = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss') + ' [http] ' +
      JSON.stringify(log) + '\n'
    fs.appendFileSync(ctx.app.baseDir + '/logs/httpLog.log', data)
  }
}
