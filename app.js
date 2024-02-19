const express = require('express')
const app = express()
const {returnHealthcheck, returnAllEndpoints, returnAllTopics, returnArticleById} = require('./controllers/app.controller.js')

app.get('/api/healthcheck', returnHealthcheck)

app.get('/api', returnAllEndpoints)

app.get('/api/topics', returnAllTopics)

app.get('/api/articles/:article_id', returnArticleById)

app.use((err, request, response, next) => {
    switch (err.code) {
        case '22P02':
        response.status(400).send({msg: 'Bad request'});
        break;
    }
    next(err)
})

app.use((err, request, response, next) => {
    if (err.status && err.msg) response.status(err.status).send({msg: err.msg})
})

app.use((err, request, response, next) => {
    console.log('500 Error - ', err);
    response.status(500).send({msg: 'Internal Server Error'})
})

module.exports = app