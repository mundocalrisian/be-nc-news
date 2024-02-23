const { log } = require('console')
const db = require('../db/connection.js')
const fs = require('fs/promises')

function selectEndpoints(){
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
    .then((fileContents) => {
    return JSON.parse(fileContents)
    })
}

function selectAllTopics(){
    return db.query('SELECT * FROM topics')
        .then((results) => results.rows)
}

function checkTopic(topic){
    return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
    .then((result) => result.rows)
}

function selectAllArticles(topic){
        
    const queryValues = []
    let sqlStr = `
    SELECT articles.article_id, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
    FROM comments
    RIGHT JOIN articles 
    ON comments.article_id = articles.article_id `

    if (topic) {
        sqlStr += ` 
    WHERE topic = $1`
        queryValues.push(topic)
    }

    sqlStr += ` 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    
    return db.query(sqlStr, queryValues)
    .then((allArticles) => {
        allArticles.rows.forEach((article) => {
            article.comment_count = Number(article.comment_count)
        })
        return allArticles.rows
    })
}

function selectArticleById(articleId){
    return db.query(`
    SELECT articles.article_id, articles.author, articles.title, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.body) AS comment_count
    FROM comments
    RIGHT JOIN articles
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [articleId])
    .then((result) => {
        if (result.rows.length === 0) return Promise.reject({status: 404, msg: 'article does not exist'})
        result.rows[0].comment_count = Number(result.rows[0].comment_count)
        return result.rows[0]})
}

function selectCommentsByArticleId(articleId){
    return db.query(`
    SELECT *
    FROM comments
    JOIN articles
    ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;
    `, [articleId])
    .then((comments) => {
        return comments.rows
    })
}

function insertNewComment(articleId, newComment){
    return db.query(`
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [articleId, newComment.author, newComment.body])
    .then((result) => {
        return result.rows
    })

}

function updateArticleByArticleId(articleId, incVotes){
    return db.query(`
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
    `, [articleId, incVotes])
    .then((result) => {
        if (result.rows.length === 0) return Promise.reject({status: 404, msg: 'article does not exist'})
        return result.rows[0]
    })
}

module.exports = {selectAllTopics, selectEndpoints, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertNewComment, updateArticleByArticleId, checkTopic}