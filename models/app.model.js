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
        .then((results) => {
            return results.rows
        })
}

module.exports = {selectAllTopics, selectEndpoints}