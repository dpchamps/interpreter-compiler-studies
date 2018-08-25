class Token {
    static isEqual(a, b){
        return a.type === b.type;
    }
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }

    equals(token){
        return this.type === token.type;
    }

    is(tokenType){
        return this.type === tokenType;
    }

    toString() {
        return `TOKEN(${this.type}, ${this.value})`;
    }
}

module.exports = Token;