class CustomError extends Error{
    constructor(message, type){
        super();
        this.message = message;
        this.type = type || 'CustomError';
    }
}

class UnexpectedInput extends CustomError{
    constructor(message){
        super(message, 'UnexpectedInput');
    }
}

module.exports = {
    UnexpectedInput
};