const express = require('express')
const app = express()
const {returnHealthcheck, returnAllEndpoints, returnAllTopics, returnArticleById, returnAllArticles, returnCommentsByArticleId} = require('./controllers/app.controller.js')
const {handlePsqlErrors, handleCustomErrors, handle500Errors} = require('./controllers/errors.controller.js')

app.get('/api/healthcheck', returnHealthcheck)

app.get('/api', returnAllEndpoints)

app.get('/api/topics', returnAllTopics)

app.get('/api/articles/:article_id', returnArticleById)

app.get('/api/articles', returnAllArticles)

app.get('/api/articles/:article_id/comments', returnCommentsByArticleId)

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handle500Errors)

module.exports = app