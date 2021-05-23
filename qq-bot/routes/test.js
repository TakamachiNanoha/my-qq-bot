const router = require('koa-router')()

router.prefix('/test')

router.get('/ws', function (ctx, next) {
    consoleLogger.info('query: ' + JSON.stringify(ctx.query));
    ctx.body = {
        success: true
    };
})

module.exports = router