class Token {
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }

    toString() {
        return `TOKEN(${this.type}, ${this.value})`;
    }
}

module.exports = Token;