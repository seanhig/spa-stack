

enum LogLevel {
    trace = 10,
    debug = 20,
    info = 30,
    warn = 40, 
    error = 50,
    fatal = 60,
    silent = Infinity
}

const logger = require('pino')();

let level: LogLevel = LogLevel.info;

if(process.env.LOG_LEVEL) {
    if(process.env.LOG_LEVEL.length < 3) {
        // it is entered as the number
        level = parseInt(process.env.LOG_LEVEL) as LogLevel;
    } else {
        // is is the name
        let levelName: string = process.env.LOG_LEVEL;
        switch(levelName) {
            case 'trace':
                level = LogLevel.trace;
                break;
            case 'debug':
                level = LogLevel.debug;
                break;
            case 'info':
                level = LogLevel.info;
                break;
            case 'warn':
                level = LogLevel.warn;
                break;
            case 'error':
                level = LogLevel.error;
                break;
            case 'error':
                level = LogLevel.fatal;
                break;
    
        }
    }
}
logger.level = level;

export default logger;