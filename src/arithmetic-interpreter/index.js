const log = require('../util/Log');
const getArgs = require('../util/getArgs');
const Interpreter = require('./modules/Interpreter');
const Lexer = require('./modules/Lexer');
(()=>{

    const {expression} = getArgs('expression');
    log.INFO(`Recieved the following expression: ${expression}`);

    try{
        const lexer = new Lexer(expression);
        lexer.tokenize();
        log.INFO(`Got the following tokens: ${lexer.tokens}`);
        const interpreter = new Interpreter(lexer.tokens);
        const result = interpreter.expression();
        log.INFO(`The result is: ${result}`);
    }catch(e){
        log.ERROR(`Caught a fatal error ${e} exiting...`);
    }

    process.exit();
})();