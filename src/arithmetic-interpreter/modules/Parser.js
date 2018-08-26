const TokenType = require('../types/token-types');
const {BinaryOpNode, NumberNode, UnaryOpNode} = require('../../data-structures/AST');
const Symbols = require('../types/symbols');
const log = require('../../util/Log');
const {UnexpectedInput} = require('../../util/Error');

class Parser{
    constructor(lexer){
        this.lexer = lexer;
        this.lexer.initialize();
        this.currentToken = this.lexer.getNextToken();
    }

    error(e) {
        log.ERROR(`The Interpreter encountered a fatal exception: ${e.type} @ token ${this.currentToken}`);
        throw e;
    }

    eat(validToken, ...validTokens){
        validTokens.push(validToken);
        if(validTokens.includes(this.currentToken.type)){
            const token = this.currentToken;
            this.currentToken = this.lexer.getNextToken();
            return token;
        }else{
            this.error(
                new UnexpectedInput(`Expected ${validTokens.join(', ')} but got ${this.currentToken}`)
            );
        }
    }

    factor(){
        const token = this.eat(TokenType.INTEGER, TokenType.LPAREN, TokenType.PLUS, TokenType.MINUS);
        let node;

        switch(token.type){
            case TokenType.PLUS:
                node = new UnaryOpNode(token, this.factor());
                break;
            case TokenType.MINUS:
                node = new UnaryOpNode(token, this.factor());
                break;
            case TokenType.INTEGER:
                node = new NumberNode(token);
                break;
            case TokenType.LPAREN:
                node = this.evaluate();
                this.eat(TokenType.RPAREN)
        }

        return node;
    }

    term(){
        let node = this.factor();

        while([TokenType.MULTIPLY, TokenType.DIVIDE].includes(this.currentToken.type)){
            const operator = this.eat(TokenType.MULTIPLY, TokenType.DIVIDE);
            node = new BinaryOpNode(node, operator, this.factor());
        }

        return node;
    }

    expr(){
        let node = this.term();

        while([TokenType.PLUS, TokenType.MINUS].includes(this.currentToken.type)){
            const operator = this.eat(TokenType.PLUS, TokenType.MINUS);

            node = new BinaryOpNode(node, operator, this.term());
        }

        return node;
    }

    evaluate(){
        return this.expr();
    }

    parse(){
        return this.evaluate();
    }
}

module.exports = Parser;