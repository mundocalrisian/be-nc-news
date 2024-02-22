const { topicData } = require('../db/data/test-data/index.js')
const {selectAllTopics, selectEndpoints, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertNewComment, updateArticleByArticleId, checkTopic} = require('../models/app.model.js')
const {selectAllComments, deleteFromCommentId} = require('../models/comments.model.js')
const {selectAllUsers} = require('../models/users.model.js')

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

function returnAllUsers(request, response, next){
    selectAllUsers()
    .then((usersArray) => {
        response.status(200).send({users: usersArray})
    })
    .catch(next)
}

function returnAllArticles(request, response, next){
    const queryKey = Object.keys(request.query)
    const toCheck = queryKey[0]

    switch (toCheck) {
        case undefined:
            selectAllArticles().then((result) => {
                response.status(200).send({articles: result})
            })
            break;
        case 'topic':
            const topic = request.query.topic
            const promises = [selectAllArticles(topic), checkTopic(topic)]
            Promise.all(promises).then((resolutions) => {
                    if (resolutions[1].length === 0){   
                        response.status(400).send({msg: 'bad request'})
                    } else {
                        response.status(200).send({articles: resolutions[0]})
                    }
                })
            break;
        default:
            response.status(400).send({msg: 'bad request'})
            break;
    }
    
}

function returnArticleById(request, response, next){
    const articleId = request.params.article_id
    selectArticleById(articleId)
    .then((articleObj) => {
        response.status(200).send({article: articleObj})
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

function postCommentByArticleId(request, response, next){
    const articleId = request.params.article_id
    const newComment = request.body
    if (Object.keys(newComment).length !== 2){
        return response.status(400).send({msg: 'Bad request'})
    }
    
    insertNewComment(articleId, newComment)
    .then((newComment) => {
        response.status(201).send({postedComment: newComment[0]})
    })
    .catch(next);
}

function patchArticleByArticleId(request, response, next){
    const articleId = request.params.article_id
    const incVotes = request.body.inc_votes
    
    if (Object.keys(request.body).length !== 1){
        return response.status(400).send({msg: 'Bad request'})
    }
    updateArticleByArticleId(articleId, incVotes)
    .then((updatedArticle) => {
        response.status(200).send({updated_article: updatedArticle})
    })
    .catch(next)

    
}

function deleteCommentByCommentId(request, response, next){
    const commentId = request.params.comment_id
    
    deleteFromCommentId(commentId)
    .then((deletedComment) => {
        response.status(204).send()
    })
    .catch(next)
}


module.exports = {returnHealthcheck, returnAllEndpoints, returnAllTopics, returnArticleById, returnAllArticles, returnCommentsByArticleId, postCommentByArticleId, patchArticleByArticleId, deleteCommentByCommentId, returnAllUsers}