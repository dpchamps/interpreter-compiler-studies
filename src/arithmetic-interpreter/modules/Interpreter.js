const log = require('../../util/Log');
const {UnexpectedInput} = require('../../util/Error');
const {INTEGER, PLUS, MINUS, EOF} = require('../types/token-types');
const Token = require('./Token');

class Interpreter {
    constructor(input) {
        this.input = input;
        this.index = 0;
        this.currentToken = null;
        this.currentChar = this.input[this.index];
    }

    _isWhiteSpace(str) {
        return (/\s/.exec(str)) !== null;
    }

    _isNumber(str) {
        return /[0-9]/.exec(str) !== null;
    }

    handleError(error) {
        log.ERROR(`Encoutered a fatal error: ${error.type || 'ERROR'}\n\t${error.message}`);
        throw error;
    }

    advance() {
        this.index += 1;
        if (this.index > this.input.length - 1) {
            this.currentChar = null;
        } else {
            this.currentChar = this.input[this.index];
        }
    }

    skipWhitespace() {
        while (this._isWhiteSpace(this.currentChar)) {
            this.advance();
        }
    }

    getInteger() {
        let buffer = "";
        while (this.currentChar !== null && this._isNumber(this.currentChar)) {
            buffer += this.currentChar;
            this.advance();
        }
        return Number(buffer);
    }

    getNextToken() {
        let token;

        this.skipWhitespace();

        if (this._isNumber(this.currentChar)) {
            token = new Token(INTEGER, this.getInteger());
        }else if (this.currentChar === '+') {
            token = new Token(PLUS, '+');
            this.advance();
        }else if (this.currentChar === '-') {
            token = new Token(MINUS, '-');
            this.advance();
        }else if (this.currentChar === null) {
            token = new Token(EOF);
            this.advance();
        }

        if (typeof token === 'undefined') {
            const errorMessage = `Interpreter received an unexpected input at string position ${this.index}, from character ${this.currentChar}`;
            this.handleError(new UnexpectedInput(errorMessage));
        }


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

    term(){
        const token = this.verifyAndGetNextToken(INTEGER);
        return token.value;
    }

    expression() {
        this.step();

        let result = this.term();
        while (this.currentToken.type !== EOF){
            const token = this.verifyAndGetNextToken(PLUS, MINUS);
            if(token.type === PLUS){
                result += this.term();
            }else if(token.type === MINUS){
                result -= this.term();
            }
        }

        return result;
    }
}

module.exports = Interpreter;