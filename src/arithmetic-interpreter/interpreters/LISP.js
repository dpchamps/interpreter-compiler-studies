const Visitor = require('../modules/Visitor');
const Lexer = require('../modules/Lexer');
const Parser = require('../modules/Parser');
const TokenType = require('../types/token-types');

/**
 * Node Visitor to translate an AST to Common LISP-style notation
 */
class LISP extends Visitor {
    constructor(input) {
        super();
        const lexer = new Lexer(input);
        this.parser = new Parser(lexer)
    }

    visit_BinaryOpNode(node) {
        let expression = '';

        const leftNode = this.visit(node.left);
        const rightNode = this.visit(node.right);

        if (!node.token.equals(node.left.token)) {
            expression += node.operation + ' ';
        }

        if (!node.left.token.is(TokenType.INTEGER)
            && node.left.operation !== node.operation
        ) {
            expression += `(${leftNode}) `;
        } else {
            expression += `${leftNode} `;
        }

        if (!node.right.token.is(TokenType.INTEGER)
            && node.right.operation !== node.operation
        ) {
            expression += `(${rightNode})`;
        } else {
            expression += `${rightNode}`;
        }

        return expression;
    }

    visit_UnaryOpNode() {

    }

    visit_NumberNode(node) {
        return node.value;
    }

    parse() {
        const tree = this.parser.parse();
        return `(${this.visit(tree)})`;
    }
}

module.exports = LISP