const BinaryOp = require('./BinaryOp');
const Number = require('./Number');
const UnaryOp = require('./UnaryOp');
const Visitor = require('./Visitor');

module.exports = {
    Node : {BinaryOp, Number, UnaryOp},
    Visitor
};