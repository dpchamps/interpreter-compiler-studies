const AST = require('./AST');

/**
 * A Unary Operator AST node.
 *
 *  -2
 *      |
 *     UnaryOP -node-> Number
 *     (-)             (2)
 *
 */
class UnaryOpNode extends AST{
    /**
     * Create a UnaryOp Node
     *
     * @param token - token representing the unary operator
     * @param node - the descendant node of the unary operator
     */
    constructor(token, node){
        super(token);
        this.node = node;
    }
}

module.exports = UnaryOpNode;