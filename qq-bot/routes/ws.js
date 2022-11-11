const router = require("koa-router")();
const cqhttp = require("../utils/cqhttp.utils");

const plugins = ["stock"];
const postType = ["message", "notice", "request"];

const bot_qq_number = "262174358";

router.all("/ws", async function (ctx) {
  ctx.websocket.send("连接成功");

  ctx.websocket.on("message", function (event) {
    consoleLogger.info("[go-cqhttp] event: " + event);
    event = JSON.parse(event);

    if (postType.indexOf(event.post_type) < 0) {
      consoleLogger.info("不支持的post类型");
      return;
    }

    if (event.message.indexOf(`[CQ:at,qq=${bot_qq_number}]`) < 0) {
      return;
    }

    if (_.get(event, "message_type") === "group") {
      const callback = (message) => {
        message = `[CQ:at,qq=${event.user_id}] ` + message;
        cqhttp.sendGroupMessage(event.group_id, message);
      };

      for (let i = 0; i < plugins.length; i++) {
        require(`../plugins/${plugins[i]}/main`)(event, callback);
      }
    }
  });
});

module.exports = router;
