const {selectAllTopics} = require('../models/app.model.js')    

function returnHealthcheck(request, response) {
    response.status(200).send({msg: 'Healthcheck ok'})
}

function returnAllTopics(request, response) {
    selectAllTopics ()
    .then((topicsArray) => {
        response.status(200).send({topics: topicsArray})
    })
}

module.exports = {returnHealthcheck, returnAllTopics}