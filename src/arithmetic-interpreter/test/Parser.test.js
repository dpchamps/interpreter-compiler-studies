"user strict"
const Parser = require('../modules/Parser');
const Lexer = require('../modules/Lexer');
const {INTEGER, PLUS, MINUS, MULTIPLY, LPAREN, RPAREN, DIVIDE, EOF, VOID} = require('../types/token-types');
const SYMBOL = require('../types/symbols');
const Token = require('../modules/Token');
const {UnexpectedInput, OutOfRange} = require('../../util/Error');
const {BinaryOpNode, NumberNode, UnaryOpNode} = require('../../data-structures/AST');

describe('Parser', () => {
    let parser;

    const setBuffer = (stringBuffer) => {
        parser.lexer.stringBuffer = stringBuffer;
        parser.lexer.initialize();
        parser.currentToken = parser.lexer.getNextToken();
    };

    beforeEach(() => {
        const lexer = new Lexer('(1+2)*(3-4)/(1/2/3/4)*(-1)');
        parser = new Parser(lexer);
    });

    describe('eat', () => {
        it('Should compare against one token', () => {
            const token = parser.eat(LPAREN);

            expect(token.is(LPAREN)).toBe(true);
        });

        it('Should compare against many tokens', () => {
            const token1 = parser.eat(LPAREN, RPAREN);
            const token2 = parser.eat(INTEGER, MULTIPLY);

            expect(token1.is(LPAREN)).toBe(true);
            expect(token2.is(INTEGER)).toBe(true);
        });

        it('Should report an error if the current token is not expected', () => {
            parser.error = jest.fn();
            parser.eat(MULTIPLY);
            expect(parser.error).toHaveBeenCalled();
        });
    });

    describe('factor', () => {
        it('Should return a unary operator node', () => {
            setBuffer('-1');
            const node1 = parser.factor();
            expect(node1.constructor).toBe(UnaryOpNode);
            expect(node1.childNode.value).toBe(1);

            setBuffer('+3');
            const node2 = parser.factor();
            expect(node2.constructor).toBe(UnaryOpNode);
            expect(node2.childNode.value).toBe(3);
        });

        it('Should return a Number node', () => {
            setBuffer('10');
            const node = parser.factor();

            expect(node.constructor).toBe(NumberNode);
            expect(node.value).toBe(10);
        });

        it('Should evaluate a parenthetical expression', () => {
            setBuffer('(10+10)');
            const node = parser.factor();

            expect(node.constructor).toBe(BinaryOpNode);
        });
    });

    describe('term', () => {
        it('Should return a binary operation node with multiplication', () => {
            setBuffer('5*10');
            const node = parser.term();

            expect(node.constructor).toBe(BinaryOpNode);
            expect(node.left.value).toBe(5);
            expect(node.operation).toBe(MULTIPLY);
            expect(node.right.value).toBe(10);
        });

        it('Should return a binary operation node with division', () => {
            setBuffer('2/3');
            const node = parser.term();

            expect(node.constructor).toBe(BinaryOpNode);
            expect(node.left.value).toBe(2);
            expect(node.operation).toBe(DIVIDE);
            expect(node.right.value).toBe(3);
        });
    });

    describe('factor', () => {
        it('Should return a binary operation node with addition', () => {
            setBuffer('5+10');
            const node = parser.expr();

            expect(node.constructor).toBe(BinaryOpNode);
            expect(node.left.value).toBe(5);
            expect(node.operation).toBe(PLUS);
            expect(node.right.value).toBe(10);
        });

        it('Should return a binary operation node with subtraction', () => {
            setBuffer('2-3');
            const node = parser.expr();

            expect(node.constructor).toBe(BinaryOpNode);
            expect(node.left.value).toBe(2);
            expect(node.operation).toBe(MINUS);
            expect(node.right.value).toBe(3);
        });
    });

    describe('evaluate', () => {
        it('Should call the production with the least precedence', () => {
            setBuffer('10');
            const spy = jest.spyOn(parser, 'expr');

            parser.evaluate();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('parse', () => {
        it('Should call the entry method', () => {
            setBuffer('1');
            const spy = jest.spyOn(parser, 'evaluate');

            parser.parse();
            expect(spy).toHaveBeenCalled();
        })
    })
});