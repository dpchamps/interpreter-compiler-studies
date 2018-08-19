"use strict";
const {INTEGER, PLUS, MINUS, MULTIPLY, DIVIDE, EOF, VOID} = require('../types/token-types');
const SYMBOL = require('../types/symbols');
const Token = require('./Token');
const {UnexpectedInput, OutOfRange} = require('../../util/Error');
const log = require('../../util/Log');

class Lexer {
    static isWhiteSpace(char){
        return /\s/.exec(char) !== null;
    }

    static isDigit(char){
        return /[0-9]/.exec(char) !== null;
    }

    error(e){
        log.ERROR(`Lexer encountered a fatal exception: ${e.type} | ${e.message} @
            Buffer: ${this.stringBuffer.split('').map((x, idx) => (idx === this.index) ? '['+x+']' : x)}`);
        throw e;
    }

    constructor(input){
        this.stringBuffer = input;
        this.index = 0;
        this.currentChar = null;
        this.tokens = [];
    }

    initialize(){
        this.index = 0;
        this.currentChar = this.stringBuffer[this.index] || null;
    }

    setIndex(idx){
        if(idx < 0 || idx > this.stringBuffer.length-1){
            const error = new OutOfRange(`Tried to set the lexer to an invalid index`);
            this.error(error)
        }

        this.index = idx;
        this.currentChar = this.stringBuffer[this.index];
    }

    skipWhitespace(){
        while(Lexer.isWhiteSpace(this.currentChar)){
            this.advance();
        }
    }

    integer(){
        let buffer = "";
        while(Lexer.isDigit(this.currentChar)){
            buffer += this.currentChar;
            this.advance();
        }

        //type check, for sanity
        if(isNaN(Number(buffer)) || buffer === null || buffer === ""){
            const error = new UnexpectedInput(`Expected ${buffer} to be a number`);
            this.error(error);
        }

        return Number(buffer);
    }

    advance(){
        this.index += 1;
        this.currentChar = this.stringBuffer[this.index] || null;
    }

    tokenize(){
        this.initialize();
        let lastToken = new Token(VOID);

        while(lastToken.type !== EOF){
            let token = null;

            this.skipWhitespace();
            if(Lexer.isDigit(this.currentChar)){
                token = new Token(INTEGER, this.integer());
            }else{
                switch (this.currentChar) {
                    case SYMBOL.ADD:
                        token = new Token(PLUS, '+');
                        break;
                    case SYMBOL.SUBTRACT:
                        token = new Token(MINUS, '-');
                        break;
                    case SYMBOL.MULTIPLY:
                        token = new Token(MULTIPLY, '*');
                        break;
                    case SYMBOL.DIVIDE:
                        token = new Token(DIVIDE, '/');
                        break;
                    case null:
                        token = new Token(EOF);
                }
                this.advance();
                lastToken = token;
            }

            if(token === null){
                const error = new UnexpectedInput(`Invalid input ${this.currentChar}`);
                this.error(error);
            }

            this.tokens.push(token);
        }
    }
}

module.exports = Lexer;