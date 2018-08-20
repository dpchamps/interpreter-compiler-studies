"use strict";

const Interpreter = require('../modules/Interpreter');
const {INTEGER, PLUS, MINUS, MULTIPLY, DIVIDE, EOF, VOID} = require('../types/token-types');
const SYMBOL = require('../types/symbols');
const Token = require('../modules/Token');
const {UnexpectedInput, OutOfRange} = require('../../util/Error');

describe('Interpreter', () => {
    let interpreter;
    beforeEach(() => {
        interpreter = new Interpreter([])
    });
    describe('currentToken', () => {
        it('Should return null if no tokens are left', () => {
            expect(interpreter.currentToken).toBe(null);
        });
        it('Should return the first token in the queue', () => {
            interpreter.tokens = [new Token(EOF)];
            expect(interpreter.currentToken.type).toBe(EOF)
        });
    });

    describe('shiftTokenQueue', () => {
        beforeEach(() => {
            interpreter.tokens = [new Token(PLUS), new Token(EOF)];
        });
        it('Should remove the first token in the array', () => {
            interpreter.shiftTokenQueue();
            expect(interpreter.currentToken.type).toBe(EOF);
        });

        it('Should return the token that is being removed from the array', () => {
            expect(interpreter.shiftTokenQueue().type).toBe(PLUS);
        });
    });

    describe('verifyAndShift', () => {
        it('Should accept a token as valid, one there is only one possibility', () => {
            interpreter.tokens = [new Token(INTEGER)];
            expect(interpreter.verifyAndShift(INTEGER)).toEqual(expect.any(Object))
        });

        it('Should accept a token as valid if it matches at least one of the possible valid tokens', () => {
            interpreter.tokens = [new Token(INTEGER)];
            expect(interpreter.verifyAndShift(INTEGER, PLUS, MINUS)).toEqual(expect.any(Object))
        });

        it('Should throw an error if a token does not match the single possibility', () => {
            interpreter.tokens = [new Token(INTEGER)];
            const fn = () => interpreter.verifyAndShift(PLUS);
            expect(fn).toThrowError(UnexpectedInput);
        });

        it('Should throw an error if a token does not match any possibilities', () => {
            interpreter.tokens = [new Token(INTEGER)];
            const fn = () => interpreter.verifyAndShift(PLUS, MINUS, DIVIDE);
            expect(fn).toThrowError(UnexpectedInput);
        });
    });

    describe('term', () => {
        let verifyAndShiftSpy;
        beforeEach(() => {
            interpreter.tokens = [new Token(INTEGER, 9)];
            verifyAndShiftSpy = jest.spyOn(interpreter, 'verifyAndShift');
        });

        it('Should verify that the current token in an integer', () => {
            interpreter.factor();
            expect(verifyAndShiftSpy).toHaveBeenLastCalledWith(INTEGER);
        });

        it('Should return the verified token\'s value', () => {
            expect(interpreter.factor()).toBe(9);
        });

    });

    describe('expression', () => {
        it('Should parse an array of tokens with a valid simple structure', () => {
            interpreter.tokens = [new Token(INTEGER, 2),new Token(PLUS, SYMBOL.ADD), new Token(INTEGER, 2), new Token(EOF)];

            expect(interpreter.evaluate()).toBe(4);
        });

        it('Should parse an array of tokens with a valid complex structure', () => {
            interpreter.tokens = [new Token(INTEGER, 2),new Token(PLUS, SYMBOL.ADD), new Token(INTEGER, 2), new Token(MINUS, SYMBOL.SUBTRACT), new Token(INTEGER, '2'), new Token(MINUS, SYMBOL.SUBTRACT), new Token(INTEGER, 4) , new Token(EOF)];

            expect(interpreter.evaluate()).toBe(-2);
        });

        it('Should raise an exception on parsing an array of tokens with an invalid structure', () => {
            interpreter.tokens = [new Token(INTEGER, 2),new Token(INTEGER, 2), new Token(EOF), new Token(PLUS, SYMBOL.ADD)];
            const fn = () => interpreter.evaluate();

            expect(fn).toThrowError(UnexpectedInput)
        })
    });
});