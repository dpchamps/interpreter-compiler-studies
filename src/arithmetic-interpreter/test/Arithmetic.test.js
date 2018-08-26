const Arithmetic = require('../interpreters/Arithmetic');

describe('Arithmetic', () => {
    it('Should evaluate infix expressions and convert them to Arithmetic-style prefix expressions', () => {
        const arithmetic1 = new Arithmetic('1+1');
        expect(arithmetic1.parse()).toBe(2);

        const arithmetic2 = new Arithmetic('2*2*2');
        expect(arithmetic2.parse()).toBe(8);

        const arithmetic3 = new Arithmetic('10 / 5');
        expect(arithmetic3.parse()).toBe(2);

        const arithmetic4 = new Arithmetic('(2 + 2) * (10 - 2) * 2');
        expect(arithmetic4.parse()).toBe(64);

        const arithmetic5 = new Arithmetic('((1+1) * (2+2)) / (2-2-2-2)');
        expect(arithmetic5.parse()).toBe(-2);


        const arithmetic6 = new Arithmetic('---2');
        expect(arithmetic6.parse()).toBe(-2);

        const arithmetic7 = new Arithmetic('----2');
        expect(arithmetic7.parse()).toBe(2);

        const arithmetic8 = new Arithmetic('---2 * +2');
        expect(arithmetic8.parse()).toBe(-4);
    });
});