const router = require('koa-router')()
const logger = require('../logger')
const outLogger = logger.getOutLogger();

router.all('/ws', async function (ctx) {
    ctx.websocket.send('连接成功');

    ctx.websocket.on('message', function (message) {
        outLogger.info(message);
    });
});

module.exports = router