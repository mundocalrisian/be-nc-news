const express = require('express')
const app = express()
const {returnHealthcheck, returnAllEndpoints, returnAllTopics} = require('./controllers/app.controller.js')

app.get('/api/healthcheck', returnHealthcheck)

app.get('/api', returnAllEndpoints)

app.get('/api/topics', returnAllTopics)

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send({msg: 'Internal Server Error'})
})

module.exports = app