const router = require('koa-router')()
const consoleLogger = require('../logger').consoleLogger

router.prefix('/test')

router.post('/ws', function (ctx, next) {
    consoleLogger.info('body: ' + ctx.request.body);
    ctx.body = {
        success: true
    };
})

module.exports = router