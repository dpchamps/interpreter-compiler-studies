const log = require('../util/Log');
const getArgs = require('../util/getArgs');

const Postfix = require('./interpreters/Postfix');
const LISP = require('./interpreters/LISP');
const Arithmetic = require('./interpreters/Arithmetic');
(()=>{

    const {type, expression} = getArgs('type', 'expression');
    log.INFO(`Recieved the following expression: ${expression}`);

    try{
        let result;
        let interpreter;

        switch(type){
            case 'evaluate':
               interpreter = new Arithmetic(expression);
               break;
            case 'postfix':
                interpreter = new Postfix(expression);
                break;
            case 'lisp':
                interpreter = new LISP(expression);
                break;
            default:
                throw new TypeError(`Invaid interpreter type input: ${type}`);
        }

        result = interpreter.parse();
        log.INFO(`The result is: ${JSON.stringify(result, null, 1)}`);
    }catch(e){
        log.TRACE(`Caught a fatal error ${e} exiting...`);
    }

    process.exit();
})();