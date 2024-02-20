const { response } = require('../app.js')
const {selectAllTopics, selectEndpoints, selectArticleById, selectAllArticles, selectCommentsByArticleId} = require('../models/app.model.js')    

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

function returnArticleById(request, response, next){
    const articleId = request.params.article_id
    selectArticleById(articleId)
    .then((articleObj) => {
        response.status(200).send({article: articleObj})
    })
    .catch(next)
}

function returnAllArticles(request, response, next){
    selectAllArticles()
    .then((allComments) => {
        response.status(200).send({articles: allComments})
    })
    .catch(next)
}

function returnCommentsByArticleId(request, response, next){
    const articleId = request.params.article_id
    const promises = [
        selectCommentsByArticleId(articleId), 
        selectArticleById(articleId)
    ]

    Promise.all(promises).then((resolutions) => {
        if (resolutions[0].length === 0) {
            response.status(200).send({msg: 'No comments associated', comments: resolutions[0]})
        } else {
            response.status(200).send({comments: resolutions[0]})
        }
    })
    .catch(next)
}

module.exports = {returnHealthcheck, returnAllEndpoints, returnAllTopics, returnArticleById, returnAllArticles, returnCommentsByArticleId}