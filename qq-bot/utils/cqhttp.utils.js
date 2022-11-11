const axios = require("axios");

const config = {
  go_cq_http_address: "http://localhost:5700/",
  test_address: "http://localhost:3000/test/",
};

async function sendToGoCqhttp(path, params) {
  const result = await axios.get(`${config.go_cq_http_address}${path}`, {
    params: params,
  });
  return result;
}

async function sendToTest(path, params) {
  const result = await axios.get(`${config.test_address}${path}`, {
    params: params,
  });
  return result;
}

async function sendGroupMessage(group_id, message) {
  const params = {
    group_id: group_id,
    message: message,
  };

  const result = await sendToGoCqhttp("send_group_msg", params);
  //const result = await sendToTest('ws', params);

  return result.data;
}

module.exports = {
  sendGroupMessage: sendGroupMessage,
};
