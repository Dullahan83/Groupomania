const database = require('../util/database');
const misc = require('../util/functions')
const jsonWebToken = require('jsonwebtoken')

function getUserId(req){
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonWebToken.verify(token, process.env.jwtKey);
    const userId = decodedToken.userId;
    return userId;
}

exports.getAll = (req, res, next) => {

}

exports.create = (req, res, next) => {
    const formatDate = misc.formatDate()
    const userId = misc.getUserId(req)
    
    database.query('INSERT INTO comments(content, created_at, publications_id, users_id) VALUES(?, ?, ?, ?)',
    [req.body.content, formatDate, req.params.id, userId], function(err, results, fields){
        console.log(req.body)
        console.log("userId: " + userId);
        if(err){
            console.log(err)
        }
        else{
            res.send(results)
            console.log("Commentaire créé avec succès !")
        }
    })
}

exports.modify = (req, res, next) => {
    
}

exports.delete = (req, res, next) => {
    
}