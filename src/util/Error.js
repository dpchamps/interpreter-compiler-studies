class CustomError extends Error{
    constructor(message, type){
        super();
        this.message = message;
        this.type = type || 'GenericError';
    }
}

class UnexpectedInput extends CustomError{
    constructor(message){
        super(message, 'UnexpectedInput');
    }
}

class OutOfRange extends CustomError{
    constructor(message){
        super(message, 'OutOfRange')
    }
}

module.exports = {
    UnexpectedInput,
    OutOfRange
};