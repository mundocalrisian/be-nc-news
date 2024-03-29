const db = require('../db/connection.js')

function selectAllUsers(){
    return db.query(`
    SELECT *
    FROM users
    `)
    .then((result) => {
        return result.rows
    })
}

function selectUserByUsername(username){
    return db.query(`
    SELECT * FROM users
    WHERE username = $1`, [username])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'user does not exist'})
        }
        return result.rows[0]
    })
}

module.exports = {selectAllUsers, selectUserByUsername}