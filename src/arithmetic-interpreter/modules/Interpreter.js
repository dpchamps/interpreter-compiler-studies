const log = require('../../util/Log');
const {UnexpectedInput} = require('../../util/Error');
const {INTEGER, PLUS, MINUS, EOF} = require('../types/token-types');
const Token = require('./Token');

class Interpreter {
    constructor(input) {
        this.input = input;
        this.index = 0;
        this.currentToken = null;
    }

    _isWhiteSpace(str){
        return /\s/.exec(str) !== null;
    }
    _isNumber(str){
        return !isNaN(Number(str));
    }

    handleError(error) {
        log.ERROR(`Encoutered a fatal error: ${error.type || 'ERROR'}\n\t${error.message}`);
        throw error;
    }

    getNextToken() {
        if (this.index > this.input.length - 1) {
            return new Token(EOF);
        }

        let currentChar = this.input[this.index];

        while(this._isWhiteSpace(currentChar)){
            this.index += 1;
            currentChar = this.input[this.index];
        }

        let token;

        if (this._isNumber(currentChar)) {
            let stream = currentChar;
            let nextChar = this.input[this.index + 1];
            while(this._isNumber(nextChar)){
                stream += nextChar;
                this.index += 1;
                nextChar = this.input[this.index + 1];
            }
            token = new Token(INTEGER, Number(stream));
        }

        if (currentChar === '+') {
            token = new Token(PLUS, '+');
        }

        if(currentChar === '-'){
            token = new Token(MINUS, '-');
        }

        if (typeof token === 'undefined') {
            const errorMessage = `Interpreter recieved an unexpected input at string position ${this.index}, from character ${currentChar}`;
            this.handleError(new UnexpectedInput(errorMessage));
        }

        this.index += 1;

        return token;
    }

    step() {
        this.currentToken = this.getNextToken();
    }

    verifyAndGetNextToken(tokenType, ...validTokens) {
        validTokens.push(tokenType);
        const previousToken = this.currentToken;
        if (validTokens.includes(this.currentToken.type)) {
            this.step();
        } else {
            this.handleError(new UnexpectedInput(`Recieved an unexpected token. Got: ${this.currentToken.type}, expected ${validTokens.toString()}`));
        }

        return previousToken;
    }

    expression() {
        this.step();

        const left = this.verifyAndGetNextToken(INTEGER);
        const operator = this.verifyAndGetNextToken(PLUS, MINUS);
        const right = this.verifyAndGetNextToken(INTEGER);

        let result;

        if(operator.type === PLUS){
            result = left.value + right.value;
        }else{
            result = left.value - right.value;
        }

        return result
    }
}

module.exports = Interpreter;