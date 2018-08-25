class Visitor {
    constructor() {
        if (this.constructor === Visitor) {
            throw new TypeError(`Abstract class Visitor should not be instantiated directly.`);
        }
    }

    _defaultVisit(name) {
        throw new TypeError(`No method visit_${name} exists in implementation.`);
    }

    visit(node) {
        const method_name = `visit_${node.constructor.name}`;
        const visitor = this[method_name].bind(this) || this._defaultVisit(method_name);

        return visitor(node);
    }
}

module.exports = Visitor;