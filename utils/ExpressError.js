class ExpressError extends Error{
    constructor(statusCode, messages){
        super();
        this.statusCode=statusCode;
        this.messages = messages ;
    }
}

module.exports =  ExpressError;