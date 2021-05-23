const axios = require('axios')
const iconv = require('iconv-lite')

async function main(event, callback) {
    const message = _.get(event, 'message');

    if (!message || !/查询股票\d{6}$/.test(message)) {
        return;
    }

    const stockCode = addPrefix(message.match(/\d{6}$/)[0]);

    if (!stockCode) {
        callback("错误：无效的股票代码。")
        return;
    }

    const url = `http://hq.sinajs.cn/list=${stockCode}`;
    const result = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    result.data = iconv.decode(result.data, 'gbk');
    //consoleLogger.info(result.data);

    const stockDate = result.data.split('\"')[1];

    if (!stockDate) {
        callback("错误：无法获取股票数据，请检查输入的股票代码是否为有效股票。")
        return;
    }

    const dataList = stockDate.split(',');
    const reply = formatMessage(event.user_id, dataList)
    //consoleLogger.info(reply);
    callback(reply);
}

function formatMessage(user_id, dataList) {
    let message = `\r\n股票名称: ${dataList[0]}` +
        `\r\n当前价格: ${dataList[3]}` +
        `\r\n涨跌幅: ${((dataList[3] - dataList[2]) / dataList[2] * 100).toFixed(2)}%` +
        `\r\n昨日收盘: ${dataList[2]}` +
        `\r\n今日开盘: ${dataList[1]}` +
        `\r\n今日最高价: ${dataList[4]}` +
        `\r\n今日最低价: ${dataList[5]}` +
        `\r\n成交数: ${(dataList[8] / 100).toFixed(0)}手` +
        `\r\n成交额: ${(dataList[9] / 10000).toFixed(2)}万元`;

    return message;
}

function addPrefix(stockCode) {
    if (/^600|^601|^603|^688/.test(stockCode)) {
        stockCode = 'sh' + stockCode;
        return stockCode;
    }

    if (/^000|^002|^003|^300/.test(stockCode)) {
        stockCode = 'sz' + stockCode;
        return stockCode;
    }

    return "";
}

module.exports = main;