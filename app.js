const express = require('express')
const app = express()
const {returnHealthcheck, returnAllTopics} = require('./controllers/app.controller.js')

app.get('/api/healthcheck', returnHealthcheck)

app.get('/api/topics', returnAllTopics)

app.use((err, request, response, next) => {
    console.log(err);
})

module.exports = app