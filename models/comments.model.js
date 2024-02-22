const db = require('../db/connection.js')

function selectAllComments(){
    return db.query(`SELECT * FROM comments`)
    .then((allComments) => {
        return allComments.rows
    })
}

function deleteFromCommentId(commentId){
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
    `, [commentId])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'comment does not exist'})
        }
        return result.rows
    })
}




module.exports = {selectAllComments, deleteFromCommentId}