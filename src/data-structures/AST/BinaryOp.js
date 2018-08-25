const AST = require('./AST');

/**
 * A Binary Operation AST Node
 */
class BinaryOpNode extends AST{
    /**
     * Create a Binary Operation Node
     *
     * @param left - The left descendant node
     * @param token - The token representing the Binary Operator
     * @param right = The right descendant node
     */
    constructor(left, token, right){
        super(token);
        this.operation = token.type;
        this.left = left;
        this.right = right;
    }
}

module.exports = BinaryOpNode;