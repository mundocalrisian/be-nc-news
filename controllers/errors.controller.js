function handlePsqlErrors(err, request, response, next){
    switch (err.code) {
        case '22P02':
        response.status(400).send({msg: 'Bad request'});
        break;
        default:
            next(err)
    }
}

function handleCustomErrors(err, request, response, next){
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

function handle500Errors (err, request, response, next){
    console.log('500 Error - ', err);
    response.status(500).send({msg: 'Internal Server Error'})
}

module.exports = {handlePsqlErrors, handleCustomErrors, handle500Errors}