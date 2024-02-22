function handleInvalidEndpoint(request, response, next){
    response.status(404).send({msg: 'Path not found'})
}

function handlePsqlErrors(err, request, response, next){
    switch (err.code) {
        case '22P02':
        response.status(400).send({msg: 'Bad request'});
        break;
        case '23502':
        response.status(400).send({msg: 'Bad request'});
        break;
        case '23503':
        response.status(404).send({msg: 'does not exist'});
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

module.exports = {handleInvalidEndpoint, handlePsqlErrors, handleCustomErrors, handle500Errors}