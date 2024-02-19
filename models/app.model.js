const db = require('../db/connection.js')

function selectAllTopics(){
    return db.query('SELECT * FROM topics')
        .then((results) => {
            return results.rows
        })
}

module.exports = {selectAllTopics}