const Postfix = require('../interpreters/Postfix');

describe('Postfix', () => {
    it('Should evaluate infix expressions and convert them to postfix expressions', () => {
        const postfix1 = new Postfix('1 + 2 * 3 + 4');
        expect(postfix1.parse()).toBe('1 2 3 * + 4 +');

        const postfix2 = new Postfix('(1 + 2) * (3 + 4)');
        expect(postfix2.parse()).toBe('1 2 + 3 4 + *');

        const postfix3 = new Postfix('1 * 2 + 3 * 4');
        expect(postfix3.parse()).toBe('1 2 * 3 4 * +');

        const postfix4 = new Postfix('1 + 2 + 3 + 4');
        expect(postfix4.parse()).toBe('1 2 + 3 + 4 +');
    });
});