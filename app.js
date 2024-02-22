const express = require('express')
const app = express()
const {returnHealthcheck, returnAllEndpoints, returnAllTopics, returnArticleById, returnAllArticles, returnCommentsByArticleId, postCommentByArticleId, patchArticleByArticleId, deleteCommentByCommentId} = require('./controllers/app.controller.js')
const {handleInvalidEndpoint, handlePsqlErrors, handleCustomErrors, handle500Errors} = require('./controllers/errors.controller.js')

app.use(express.json());

app.get('/api/healthcheck', returnHealthcheck)

app.get('/api', returnAllEndpoints)

app.get('/api/topics', returnAllTopics)

app.get('/api/articles/:article_id', returnArticleById)

app.get('/api/articles', returnAllArticles)

app.get('/api/articles/:article_id/comments', returnCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticleByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentByCommentId)

app.all('/*', handleInvalidEndpoint)

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handle500Errors)

module.exports = app