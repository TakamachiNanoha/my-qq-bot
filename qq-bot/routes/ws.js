const router = require('koa-router')()
const qqUtils = require('../utils/qq.utils');
const consoleLogger = require('../logger').consoleLogger

router.all('/ws', async function (ctx) {
    ctx.websocket.send('连接成功');

    ctx.websocket.on('message', function (message) {
        consoleLogger.info(message);
        message = JSON.parse(message);

        if (!qqUtils.isAtMe(message)) {
            return;
        }

        if (qqUtils.isGroupMessage(message)) {
            const reply = `[CQ:at,qq=${message.user_id}] ?`;
            qqUtils.sendGroupMessage(message.group_id, reply)
        }
    });
});

module.exports = router