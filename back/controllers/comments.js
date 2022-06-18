const database = require('../util/database');
const misc = require('../util/functions')
const jsonWebToken = require('jsonwebtoken')

exports.getAll = (req, res, next) => {
    database.query('SELECT c.*,u.username FROM comments as c INNER JOIN users as u WHERE publications_id=? AND c.users_id=u.id',[req.params.publication_id], function(err, results, fields){
        if(err){
            return res.status(400).json({message: err.sqlMessage})
        }
        else{
            return res.status(200).json(results)
        }
    })
}

exports.create = (req, res, next) => {
    const formatDate = misc.formatDate()
    const userId = misc.getUserId(req)
    database.query('INSERT INTO comments(content, created_at, publications_id, users_id) VALUES(?, ?, ?, ?)',
    [req.body.content, formatDate, req.params.publication_id, userId], function(err, results, fields){
        if(err){
            return res.status(400).json({message: err.sqlMessage})
        }
        else{
            return res.status(201).json(results)
        }
    })
}

exports.modify = (req, res, next) => {
    const hasRights = misc.getRank(req)
    const userId = misc.getUserId(req)
    database.query('SELECT * FROM comments WHERE id=?', [req.params.comment_id], function(err, results, fields){
        if(results[0].users_id === userId || hasRights === 1){
            database.query('UPDATE comments SET content=? WHERE id=?',[req.body.content, req.params.comment_id], function(err, results, fields){
                if(err){
                    return res.status(400).json({message: err.sqlMessage})
                }
                else{
                    return res.status(200).json({message: "Modification effectuée"})
                }
            })
        }
        else if(err){
            return res.status(400).json({message: err.sqlMessage})
        }
        else{
            return res.status(403).json({message: "Vous avez pas le droit d'effectuer cette action"})
        }
    })
}

exports.delete = (req, res, next) => {
    const userId = misc.getUserId(req);
    const hasRights = misc.getRank(req)
    database.query('SELECT * FROM comments WHERE id=?', [req.params.comment_id], function(err, results, fields){
        if(results[0].users_id === userId || hasRights === 1){
            database.query('DELETE FROM comments WHERE id=?',[req.params.comment_id], function(err, results, fields){
                if(err){
                    return res.status(400).json({message: err.sqlMessage})
                }
                else{
                    return res.status(200).json(results)
                }
            })
        }
        else if(err){
            return res.status(400).json({message: err.sqlMessage});
        }
        else{
            return res.status(403).json({message: "Vous avez pas le droit d'effectuer cette action"})
        }
    })
}


