"use strict";
const Lexer = require('../modules/Lexer');
const {INTEGER, PLUS, MINUS, MULTIPLY, LPAREN, RPAREN, DIVIDE, EOF, VOID} = require('../types/token-types');
const SYMBOL = require('../types/symbols');
const Token = require('../modules/Token');
const {UnexpectedInput, OutOfRange} = require('../../util/Error');

describe('Lexer', () => {
    describe('static functions', () => {
        describe('isWhiteSpace', () => {
            it('Should correctly determine various whitespace chars', () => {
                const whitespaceChars = [' ', '\t', '\n', '\r'];

                whitespaceChars.forEach(char => {
                    expect(Lexer.isWhiteSpace(char)).toBe(true);
                });
            });

            it('Should correctly determine non-whitespace chars', () => {
                const nonWhitespaceChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+\\][|}{\';\":/.,?><';

                nonWhitespaceChars.split('').forEach(char => {
                    expect(Lexer.isWhiteSpace(char)).toBe(false);
                })
            })
        });

        describe('isDigit', () => {
            it('Should correctly determine digits', () => {
                const digits = '0123456789';

                digits.split('').forEach(char => {
                    expect(Lexer.isDigit(char)).toBe(true);
                });
            });

            it('Should correctly determine non-digits', () => {
                const nonDigits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+\\][|}{\\\';\\\":/.,?><; \t\n\r';

                nonDigits.split('').forEach(char => {
                    expect(Lexer.isDigit(char)).toBe(false);
                })
            })
        });
    });

    describe('Class functions', () => {
        let lexer;
        beforeEach(() => {
            lexer = new Lexer('');
        });

        describe('skipWhitespace', () => {
            let advanceSpy;
            beforeEach(() => {
                advanceSpy = jest.spyOn(lexer, 'advance');
            });

            it('Should skip whitespace at the beginning on the buffer', () => {
                lexer.stringBuffer = '     Start';
                lexer.initialize();
                lexer.skipWhitespace();
                expect(advanceSpy).toHaveBeenCalledTimes(5);
            });

            it('Should not skip any chars that are not spaces', () => {
                lexer.stringBuffer = 'Blahblah      sdlfkjsdlkfj';
                lexer.initialize();
                lexer.skipWhitespace();
                expect(advanceSpy).not.toHaveBeenCalled();
            });

            it('Should skip whitespace at an arbitrary index', () => {
                lexer.stringBuffer = "123\t  a";
                lexer.setIndex(3);
                lexer.skipWhitespace();
                expect(advanceSpy).toHaveBeenCalledTimes(3);
            });

            it('Should stop on the correct non-whitespace char', () => {
                lexer.stringBuffer = '     a';
                lexer.initialize();
                lexer.skipWhitespace();
                expect(lexer.currentChar).toBe('a');
            });

            it('Should skip until current char is null', () => {
                lexer.stringBuffer = ' ';
                lexer.initialize();
                lexer.skipWhitespace();
                expect(lexer.currentChar).toBe(null);
            });
        });

        describe('setIndex', () => {

            beforeEach(() => {
                lexer.stringBuffer = '012345';
                lexer.initialize();
            });

            it('Should set a zero index', () => {
                lexer.setIndex(0);
                expect(lexer.currentChar).toBe('0');
            });

            it('Should set a in-range index', () => {
                lexer.setIndex(4);
                expect(lexer.currentChar).toBe('4');
            });

            it('Should throw an error when index is out of range', () => {
                expect(() => lexer.setIndex(10)).toThrowError(OutOfRange);
                expect(() => lexer.setIndex(-9)).toThrowError(OutOfRange);
            });
        });

        describe('integer', () => {
            it('Should tokenize integers of any length', () => {
                lexer.stringBuffer = '123456789';
                lexer.initialize();

                const result = lexer.integer();

                expect(result).toBe(123456789);
            });

            it('Should read integers into a buffer and stop at characters', () => {
                lexer.stringBuffer = '1234abcd';
                lexer.initialize();

                const result = lexer.integer();

                expect(result).toBe(1234);
                expect(lexer.currentChar).toBe('a');
            });

            it('Should throw an error if a non-number gets into the buffer', () => {
               expect(()=>lexer.integer()).toThrowError(UnexpectedInput);
            })
        });

        describe('advance', () => {
            beforeEach(() => {
                lexer.stringBuffer = '12';
                lexer.initialize();
            });

            it('Should advance the current character', () => {
                lexer.advance();
                expect(lexer.currentChar).toBe('2');
            });

            it('Should advance the current character to null when there is no more buffer to consume', () => {
                lexer.advance();
                lexer.advance();
                expect(lexer.currentChar).toBe(null);
            });
        });

        describe('tokenize', () => {
            it('Should handle an empty string', () => {
                lexer.stringBuffer = '';
                lexer.initialize();
                lexer.tokenize();

                expect(lexer.tokens[0]).toEqual(new Token(EOF));
            });

            it('Should tokenize a simple expression', () => {
                lexer.stringBuffer = "2+2";
                lexer.initialize();
                lexer.tokenize();
                const tokenTypes = lexer.tokens.map(x => x.type);
                expect(tokenTypes).toEqual([INTEGER, PLUS, INTEGER, EOF]);
            });

            it('Should tokenize complex expressions', () => {
                lexer.stringBuffer = "(1+2+3)/4*5*6/7-8-9";
                lexer.initialize();
                lexer.tokenize();
                const tokenTypes = lexer.tokens.map(x => x.type);
                expect(tokenTypes).toEqual([LPAREN, INTEGER, PLUS, INTEGER, PLUS, INTEGER, RPAREN, DIVIDE, INTEGER, MULTIPLY, INTEGER, MULTIPLY, INTEGER, DIVIDE, INTEGER, MINUS, INTEGER, MINUS, INTEGER, EOF]);
            });

            it('Should throw an error on unexpected characters', () => {
                lexer.stringBuffer = "1+?";
                lexer.initialize();
                expect(()=> lexer.tokenize()).toThrowError(UnexpectedInput);
            });

            it('Should throw an error on unexpexted characters in otherwise valid inputs', () => {
                lexer.stringBuffer = "2+2^";
                lexer.initialize();
                lexer.error = jest.fn();
                lexer.tokenize();
                expect(lexer.error).toHaveBeenCalled();
            })
        })


    });
});