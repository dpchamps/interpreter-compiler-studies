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

    handleError(error) {
        log.ERROR(`Encoutered a fatal error: ${error.type || 'ERROR'}\n\t${error.message}`);
        throw error;
    }

    getNextToken() {
        if (this.index > this.input.length - 1) {
            return new Token(EOF);
        }

        const currentChar = this.input[this.index];
        let token;

        if (!isNaN(Number(currentChar))) {
            token = new Token(INTEGER, Number(currentChar));
        }

        if (currentChar === '+') {
            token = new Token(PLUS, '+');
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

    verifyAndGetNextToken(tokenType) {
        const previousToken = this.currentToken;
        if (this.currentToken.type === tokenType) {
            this.step();
        } else {
            this.handleError(new UnexpectedInput(`Recieved an unexpected token. Got: ${this.currentToken.type}, expected ${tokenType}`));
        }

        return previousToken;
    }

    expression() {
        this.step();

        const left = this.verifyAndGetNextToken(INTEGER);
        const operator = this.verifyAndGetNextToken(PLUS);
        const right = this.verifyAndGetNextToken(INTEGER);
        const result = left.value + right.value;

        return result
    }
}

module.exports = Interpreter;