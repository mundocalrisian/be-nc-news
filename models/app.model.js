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

module.exports = {selectAllTopics, selectEndpoints, selectArticleById}