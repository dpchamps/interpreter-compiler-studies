const log = require('../util/Log');
const getArgs = require('../util/getArgs');
const Interpreter = require('./modules/Interpreter');

(()=>{

    const {expression} = getArgs('expression');
    log.INFO(`Recieved the following expression: ${expression}`);

    try{
        const interpreter = new Interpreter(expression);
        const result = interpreter.expression();
        log.INFO(`The result is: ${result}`);
    }catch(e){
        log.ERROR('Caught a fatal error, exiting...');
    }


    process.exit();
})();