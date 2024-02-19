const { response } = require('../app.js')
const {selectAllTopics, selectEndpoints} = require('../models/app.model.js')    

function returnHealthcheck(request, response){
    response.status(200).send({msg: 'Healthcheck ok'})
}

function returnAllEndpoints(request, response, next){
    selectEndpoints()
    .then((endpointsObj) => {
        response.status(200).send({'endpoints': endpointsObj})
    })
    .catch(next)
}

function returnAllTopics(request, response, next){
    selectAllTopics ()
    .then((topicsArray) => {
        response.status(200).send({topics: topicsArray})
    })
    .catch(next)
}

module.exports = {returnHealthcheck, returnAllEndpoints, returnAllTopics}