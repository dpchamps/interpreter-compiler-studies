const AST = require('./AST');

/**
 * A Number AST Node
 */
class Number extends AST {
    /**
     * Create a Number Node
     * @param token - Token Representing the Number
     */
    constructor(token) {
        super(token);
        this.value = token.value;
    }
}

module.exports = Number;