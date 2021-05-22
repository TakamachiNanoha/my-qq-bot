const axios = require('axios')

const config = {
    bot_qq_number: "262174358",
    go_cq_http_address: "http://localhost:5700/",
    test_address: "http://localhost:3000/test/"
}

async function sendToGoCqhttp(path, params) {
    const result = await axios.post(`${config.go_cq_http_address}${path}`, params);
    return result;
}

async function sendToTest(path, params) {
    const result = await axios.post(`${config.test_address}${path}`, params);
    return result;
}

function isAtMe(message) {
    if (_.get(message, 'message') && _.get(message, 'message').indexOf(`[CQ:at,qq=${config.bot_qq_number}]`) > -1) {
        return true;
    }

    return false;
}

function isGroupMessage(message) {
    return _.get(message, 'message_type') && _.get(message, 'message_type') === 'group';
}

async function sendGroupMessage(group_id, message) {
    const params = {
        group_id: group_id,
        message: message
    };

    const result = await sendToGoCqhttp('send_group_msg', params);
    //const result = await sendToTest('ws', params);

    return result.data;
}

module.exports = {
    isAtMe: isAtMe,
    isGroupMessage: isGroupMessage,
    sendGroupMessage: sendGroupMessage
}