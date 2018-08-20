"use strict";
const {UnexpectedInput} = require('../../util/Error');
const log = require('../../util/Log');
const {INTEGER, PLUS, MINUS, MULTIPLY, DIVIDE, EOF, VOID} = require('../types/token-types');
const Lexer = require('./Lexer');
class Interpreter {
    constructor(input) {
        if(typeof input === 'string'){
            this.lexer = new Lexer(input);
            this.lexer.initialize();
            this.tokens = [this.lexer.getNextToken()];
        }else if(Array.isArray(input)){
            this.tokens = input;
        }else{
            this.error(UnexpectedInput(`Interpreter input should be an array of tokens, or a string. Got: ${typeof input}`));
        }
    }

    error(e) {
        log.ERROR(`The Interpreter encountered a fatal exception: ${e.type} @ token ${this.currentToken}`);
        throw e;
    }

    get currentToken() {
        return this.tokens[0] || null;
    }

    /**
     * Shift tokens, return the removed token
     * @returns {Token}
     */
    shiftTokenQueue() {
        if(this.lexer){
            this.tokens.push(this.lexer.getNextToken());
        }
        return this.tokens.shift();
    }

    /**
     * Verify the current token, and shift the queue by one.
     * @param validToken
     * @param validTokens
     * @returns {Token} - the verified token
     */
    verifyAndShift(validToken, ...validTokens) {
        validTokens.push(validToken);
        if (validTokens.includes(this.currentToken.type)) {
            return this.shiftTokenQueue();
        } else {
            const error = new UnexpectedInput(`Expected one of the following tokens: ${validTokens.join(',')}, but got ${this.currentToken}`);
            this.error(error);
        }
    }

    term(){
        const token = this.verifyAndShift(INTEGER);

        return token.value;
    }

    expression(){
        let result = this.term();
        while(this.currentToken.type !== EOF){
            const operator = this.verifyAndShift(PLUS, MINUS);
            if(operator.type === PLUS){
                result += this.term();
            }else if(operator.type === MINUS){
                result -= this.term();
            }
        }

        return result;
    }
}

module.exports = Interpreter;