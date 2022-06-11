const database = require('../util/database');
const misc = require('../util/functions')
const jsonWebToken = require('jsonwebtoken')

exports.getAll = (req, res, next) => {
    database.query('SELECT c.*,u.username FROM comments as c INNER JOIN users as u WHERE publications_id=? AND c.users_id=u.id',[req.params.publication_id], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(200).json(results)
        }
    })
}

exports.create = (req, res, next) => {
    const formatDate = misc.formatDate()
    const userId = misc.getUserId(req)
    database.query('INSERT INTO comments(content, created_at, publications_id, users_id) VALUES(?, ?, ?, ?)',
    [req.body.content, formatDate, req.params.publication_id, userId], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(201).json(results)
            console.log("Commentaire créé avec succès !")
        }
    })
}

exports.modify = (req, res, next) => {
    const hasRights = misc.getRank(req)
    console.log(req.params)
    database.query('SELECT * FROM comments WHERE id=?', [req.params.comment_id], function(err, results, fields){
        console.log(results);
        if(results[0].users_id === userId || hasRights === 1){
            database.query('UPDATE comments SET content=? WHERE id=?',[req.body.content, req.params.comment_id], function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(200).json({message: "Successfully modified"})
                    console.log("Commentaire modifié avec succès !");
                }
            })
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(403).json({message: "You don't have the permissions"})
            console.log("Erreur d'authentification, vous n'avez pas les permissions requises")
        }
    })
}

exports.delete = (req, res, next) => {
    const userId = misc.getUserId(req);
    const hasRights = misc.getRank(req)
    database.query('SELECT * FROM comments WHERE id=?', [req.params.comment_id], function(err, results, fields){
        console.log(results)
        if(results[0].users_id === userId || hasRights === 1){
            database.query('DELETE FROM comments WHERE id=?',[req.params.comment_id], function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(200).json(results)
                    console.log("Commentaire supprimé avec succès !");
                }
            })
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage});
        }
        else{
            res.status(403).json({message: "You don't have the permissions"})
            console.log("Erreur d'authentification, vous n'avez pas les permissions requises");
        }
    })
}


exports.like = (req,res,next) =>{
    const userId = misc.getUserId(req)
    database.query('SELECT value FROM comments_votes WHERE users_id=? AND comments_id=?',[userId, req.body.comments_id], function(err, results, fields){
        if(results.length === 0){
            console.log("ici");
            database.query('INSERT INTO comments_votes(users_id, comments_id, value)VALUES(?, ?, ?)',[userId, req.body.comments_id, req.body.value],
            function(err, results, fields){
                if(err){
                    console.log("ici 2");
                    res.status(401).json({message: err.sqlMessage})
                }
                if(req.body.value === 1){
                    database.query('UPDATE comments SET upvote=upvote + 1 WHERE id=?', [req.body.comments_id],function(err, results, fields){
                        if(err){
                            res.status(400).json({message: err.sqlMessage})
                        }
                        else{
                            console.log("ici 3");
                            res.status(200).json(results)
                        }
                    })
                }
                else if(req.body.value === 0){
                    database.query('UPDATE comments SET downvote=downvote + 1 WHERE id=?', [req.body.comments_id],function(err, results, fields){
                        if(err){
                            res.status(400).json({message: err.sqlMessage})
                        }
                        else{
                            console.log("ici 4");
                            res.status(200).json(results)
                        }
                    })
                }
                else{
                    res.status(400).json({message: "Vote non conforme"})
                }
            })
        }
        else if(req.body.value === 1){
            console.log(results)
            if(results[0].value === 0){
                database.query('UPDATE comments_votes SET value=1 WHERE comments_id=?',[req.body.comments_id], function(err,results,fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE comments SET downvote=downvote - 1, upvote=upvote + 1 WHERE id=?', [req.body.comments_id],
                        function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                console.log("ici 5");
                                res.status(200).json(results)
                            }
                        })
                    }
                })
            }
            else if(results[0].value === 1){
                return res.status(204).json({message:"Same vote already existing"})
            }
        }
        else if(req.body.value === 0){
            console.log(results)
            if(results[0].value === 1){
                database.query('UPDATE comments_votes SET value=0 WHERE comments_id=?',[req.body.comments_id], function(err,results,fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE comments SET downvote=downvote + 1, upvote=upvote - 1 WHERE id=?', [req.body.comments_id],
                        function(err, results, fields){
                            if(err){
                                res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                console.log("ici 7");
                                res.status(200).json(results)
                            }
                        })
                    }
                })
            }
            else if(results[0].value === 0){
                return res.status(204).json({message:"Same vote already existing"})
            }
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            if(results[0].value === 0){
                database.query('DELETE FROM comments_votes WHERE comments_id=?',[req.body.comments_id], function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE comments SET downvote=downvote - 1 WHERE id=?', [req.body.comments_id],
                        function(err, results, fields){
                            if(err){
                                res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                console.log("ici 7");
                                res.status(200).json(results)
                            }
                        })
                    }
                })
            }
            if(results[0].value === 1){
                database.query('DELETE FROM comments_votes WHERE comments_id=?',[req.body.comments_id], function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE comments SET upvote=upvote - 1 WHERE id=?', [req.body.comments_id],
                        function(err, results, fields){
                            if(err){
                                res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                console.log("ici 7");
                                res.status(200).json(results)
                            }
                        })
                    }
                })
            }
        }
    })
}