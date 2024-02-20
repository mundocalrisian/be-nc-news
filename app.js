const express = require('express')
const app = express()
const {returnHealthcheck, returnAllEndpoints, returnAllTopics, returnArticleById, returnAllArticles, returnCommentsByArticleId} = require('./controllers/app.controller.js')

app.get('/api/healthcheck', returnHealthcheck)

app.get('/api', returnAllEndpoints)

app.get('/api/topics', returnAllTopics)

app.get('/api/articles/:article_id', returnArticleById)

app.get('/api/articles', returnAllArticles)

app.get('/api/articles/:article_id/comments', returnCommentsByArticleId)

app.use((err, request, response, next) => {
    switch (err.code) {
        case '22P02':
        response.status(400).send({msg: 'Bad request'});
        break;
        default:
            next(err)
    }
})

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    console.log('500 Error - ', err);
    response.status(500).send({msg: 'Internal Server Error'})
})

module.exports = app