const db = require('../db/connection.js')

function selectAllComments(){
    return db.query(`SELECT * FROM comments`)
    .then((allComments) => {
        return allComments.rows
    })
}

function selectCommentsByArticleId(articleId){
    return db.query(`
    SELECT * FROM comments
    WHERE comments.article_id = ${articleId}`)
    .then((results) => {
        return results.rows
    })
}

module.exports = {selectAllComments, selectCommentsByArticleId}