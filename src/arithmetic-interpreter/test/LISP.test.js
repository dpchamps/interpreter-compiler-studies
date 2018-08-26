const LISP = require('../interpreters/LISP');

describe('LISP', () => {
    it('Should evaluate infix expressions and convert them to LISP-style prefix expressions', () => {
        const lisp1 = new LISP('10 * 10');
        expect(lisp1.parse()).toBe('(* 10 10)');

        const lisp2 = new LISP('100 / 2 + 10');
        expect(lisp2.parse()).toBe('(+ (/ 100 2) 10)');

        const lisp3 = new LISP('2 * 4 * 6 * 7');
        expect(lisp3.parse()).toBe('(* 2 4 6 7)');

        const lisp4 = new LISP('(2 + 2) * (10 - 2) * 2');
        expect(lisp4.parse()).toBe('(* (+ 2 2) (- 10 2) 2)');
    });
});