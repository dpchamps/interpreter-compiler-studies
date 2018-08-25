const Visitor = require('../modules/Visitor');
const Lexer = require('../modules/Lexer');
const Parser = require('../modules/Parser');
const TokenType = require('../types/token-types');

/**
 * Node Visitor to convert an AST into a value
 */
class Arithmetic extends Visitor {
    constructor(input) {
        super();
        const lexer = new Lexer(input);
        this.parser = new Parser(lexer)
    }

    visit_BinaryOpNode(node) {
        switch(node.operation){
            case TokenType.PLUS:
                return this.visit(node.left) + this.visit(node.right);
            case TokenType.MINUS:
                return this.visit(node.left) - this.visit(node.right);
            case TokenType.MULTIPLY:
                return this.visit(node.left) * this.visit(node.right);
            case TokenType.DIVIDE:
                return this.visit(node.left) / this.visit(node.right);
        }
    }

    visit_UnaryOpNode() {

    }

    visit_NumberNode(node) {
        return node.value;
    }

    parse() {
        const tree = this.parser.parse();
        return this.visit(tree);
    }
}

module.exports = Arithmetic