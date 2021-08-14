const axios = require('axios')
const iconv = require('iconv-lite')

async function main(event, callback) {
    const message = _.get(event, 'message');
    let stockCode = "";

    if (!message || message.indexOf('查询股票') < 0) {
        return;
    }

    if (/查询股票\d{6}$/.test(message)) {
        stockCode = addPrefix(message.match(/\d{6}$/)[0]);

        if (!stockCode) {
            callback("错误：无效的股票代码。");
            return;
        }
    } else {
        const strList = message.split("查询股票");

        if (!strList || strList.length < 2) {
            return;
        }

        stockCode = await getStockCodeByName(strList[1].trim());

        if (!stockCode) {
            callback("错误：无效的股票名称。");
            return;
        }
    }

    const reply = await getHq(stockCode);
    callback(reply);
}

async function getStockCodeByName(stockName) {
    const url = `https://suggest3.sinajs.cn/suggest/type=&key=${encodeURIComponent(stockName)}`;
    const result = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    result.data = iconv.decode(result.data, 'gbk');
    //consoleLogger.info(result.data);

    const stockCode = result.data.split(',')[3];
    return stockCode ? stockCode : "";
}

async function getHq(stockCode) {
    const url = `http://hq.sinajs.cn/list=${stockCode}`;
    const result = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    result.data = iconv.decode(result.data, 'gbk');
    //consoleLogger.info(result.data);

    const stockDate = result.data.split('\"')[1];

    if (!stockDate) {
        return "错误：无法获取股票数据，请检查输入的股票代码是否为有效股票。";
    }

    const dataList = stockDate.split(',');
    const reply = formatMessage(dataList);
    return reply;
}

function addPrefix(stockCode) {
    if (/^600|^601|^603|^688/.test(stockCode)) {
        stockCode = 'sh' + stockCode;
        return stockCode;
    }

    if (/^000|^001|^002|^003|^300/.test(stockCode)) {
        stockCode = 'sz' + stockCode;
        return stockCode;
    }

    return "";
}

function formatMessage(dataList) {
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

module.exports = main;