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

function selectArticleById(articleId){
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1`, [articleId])
    .then((result) => {
        if (result.rows.length === 0) return Promise.reject({status: 404, msg: 'article does not exist'})
        return result.rows[0]})
}

function selectAllArticles(){
    return db.query(`
    SELECT articles.article_id, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id) AS comment_count
    FROM comments
    RIGHT JOIN articles 
    ON comments.article_id = articles.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `)
    .then((allArticles) => {
        allArticles.rows.forEach((article) => {
            article.comment_count = Number(article.comment_count)
        })
        return allArticles.rows
    })
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
    // console.log(articleId);
    // console.log(newComment);
    return db.query(`
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [articleId, newComment.author, newComment.body])
    .then((result) => {
        // console.log(result.rows);
        return result.rows
    })

}

module.exports = {selectAllTopics, selectEndpoints, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertNewComment}