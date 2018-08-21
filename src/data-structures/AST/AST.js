/**
 * A Base Abstract Syntax Tree class
 *
 * @abstract
 */
class AST {
    /**
     * Create an abstract syntax tree node
     *
     * @param token - The token the node contains
     */
    constructor(token) {
        if (this.constructor === AST) {
            throw new TypeError(`Abstract class AST should not be instantiated directly.`);
        }
        this.token = token;
    }
}

module.exports = AST;