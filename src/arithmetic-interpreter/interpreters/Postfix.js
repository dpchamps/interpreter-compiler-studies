const Visitor = require('../modules/Visitor');
const Lexer = require('../modules/Lexer');
const Parser = require('../modules/Parser');
const TokenType = require('../types/token-types');

/**
 * Node Visitor to translate an AST to RPN
 */
class Postfix extends Visitor{
    constructor(input){
        super();
        const lexer = new Lexer(input);
        this.parser = new Parser(lexer);
    }

    visit_BinaryOpNode(node){
        return `${this.visit(node.left)} ${this.visit(node.right)} ${node.operation}`;
    }

    visit_UnaryOpNode(){

    }

    visit_NumberNode(node){
        return node.value+"";
    }

    parse(){
        const tree = this.parser.parse();
        return this.visit(tree);
    }
}

module.exports = Postfix;