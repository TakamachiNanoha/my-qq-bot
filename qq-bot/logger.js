const path = require('path');
const log4js = require('koa-log4')

log4js.configure({
    replaceConsole: true,
    appenders: {
        access: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: path.join(__dirname, 'logs', 'access.log'),
            alwaysIncludePattern: true
        },
        application: {
            type: 'dateFile',
            pattern: '-yyyy-MM-dd.log',
            filename: path.join(__dirname, 'logs', 'application.log'),
            alwaysIncludePattern: true
        },
        out: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'info'
        },
        access: {
            appenders: ['access'],
            level: 'info'
        },
        application: {
            appenders: ['application'],
            level: 'WARN'
        }
    }
})

function getOutLogger() {
    return log4js.getLogger('out');
}

function getOutKoaLogger() {
    return log4js.koaLogger(log4js.getLogger('out'));
}

module.exports = {
    getOutLogger: getOutLogger,
    getOutKoaLogger: getOutKoaLogger
}