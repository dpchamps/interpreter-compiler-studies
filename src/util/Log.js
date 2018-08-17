const chalk = require('chalk');

const WARN_COLOR = chalk.yellow;
const INFO_COLOR = chalk.green;
const ERROR_COLOR = chalk.red;
const EXTRA_COLOR = chalk.blue;

class Log {
    /**
     * Write output to the console
     *
     * @param type - for color
     * @param args - anything you wish
     */
    static WRITE(type, ...args) {
        let output;
        switch (type) {
            case 'warn':
                output = WARN_COLOR;
                break;
            case 'info':
                output = INFO_COLOR;
                break;
            case 'error':
                output = ERROR_COLOR;
                break;
            case 'extra':
                output = EXTRA_COLOR;
                break;
            default:
                args.unshift(type);
                console.log.apply(null, args);
                return
        }

        console.log(output.apply(null, args));
    }

    static WARN(...args) {
        Log.WRITE('warn', WARN_COLOR.bold('[WARN]'), args);
    }

    static ERROR(...args) {
        Log.WRITE('error', ERROR_COLOR.bold('[ERROR]'), args);
    }

    static INFO(...args) {
        Log.WRITE('info', INFO_COLOR.bold('[INFO]'), args);
    }

    static GREEN_TEXT(...args) {
        Log.WRITE('info', args);
    }

    static BLUE_TEXT(...args) {
        Log.WRITE('extra', args);
    }

    static TRACE(...args) {
        Log.WRITE('info', INFO_COLOR.bold('[TRACE]'));
        console.trace(args);
    }

}

module.exports = Log;