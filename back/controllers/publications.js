const database = require('../util/database');
const misc = require('../util/functions')
const fs = require('fs');
const jsonWebToken= require ('jsonwebtoken');
const env = require('dotenv');


exports.getAll = (req,res,next) =>{
    database.query('SELECT p.*, u.username FROM publications AS p INNER JOIN users AS u WHERE p.users_id = u.id', function(err, results, fields){
        if (err) {
            res.status(500).json({message: err.sqlMessage});
        }
        else{
            res.status(200).json(results)
        }
    })
}

exports.getOne = (req,res,next) =>{
    database.query('SELECT * FROM `publications` WHERE id=?',[req.params.publication_id], function(err, results, fields){
        if (err) {
            res.status(500).json();
        }
        else{
            res.status(200).json(results)
        }
    })
}

exports.create = (req,res,next) =>{
    const formatDate = misc.formatDate()
    const host = `${req.protocol}://${req.get('host')}`
    if(req.file !== undefined){
        const imgUrl = `${host}/images/${req.file.filename}`;
        if(req.body.content === undefined){
            database.query('INSERT INTO `publications`(`title`, `image`, `created_at`, `users_id`)values(?, ?, ?,?)',[req.body.title, imgUrl, formatDate, req.body.userId], function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(201).json({message: "Successfully created !"})
                }
            });
        }
        else{
            database.query('INSERT INTO `publications`(`title`, `image`, `content`, `created_at`, `users_id`)values(?, ?, ?, ?, ?)',[req.body.title, imgUrl,req.body.content, formatDate, req.body.userId], function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(201).json(results)
                }
            });
        }
    }
    else{
        database.query('INSERT INTO `publications`(`title`, `content`, `created_at`, `users_id`)values(?, ?, ?, ?)',[req.body.title, req.body.content, formatDate, req.body.userId], function(err, results, fields){
            if(err){
                res.status(400).json({message: err.sqlMessage})
            }
            else{
                res.status(201).json(results)
            }
        });
    }
}

exports.delete = (req,res,next) =>{
    const userId = misc.getUserId(req)
    const hasRights = misc.getRank(req)
    database.query('SELECT * FROM `publications` WHERE id=?', [req.params.publication_id], function(err, results, fields){
        if(results.length === 0){
            res.status(500).json({message: "Oops, something went wrong ..."})
        }
        else{
            if(results[0].image !== null){
                const filename = results[0].image.split('/images/')[1];
            console.log(filename)
                if(results[0].users_id === userId || hasRights === 1){
                    database.query('DELETE FROM `publications` WHERE id=?', [req.params.publication_id], function(err, results, fields){
                        fs.unlinkSync(`images/${filename}`)
                        if(err){
                            res.status(400).json({message: err.sqlMessage})
                            console.log("Erreur lors de la suppression de la publication");
                        }
                        else{
                            res.status(200).json(results)
                            console.log("Publication supprimée avec succès !");
                        }
                    })
                }
                else if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(403).json({message: "You don't have the required permissions"})
                    console.log("Erreur d'authentification, vous n'avez pas les permissions requises")
                }
            }
            else{
                if(results[0].users_id === userId || hasRights === 1){
                    database.query('DELETE FROM `publications` WHERE id=?', [req.params.publication_id], function(err, results, fields){
                        if(err){
                            res.status(400).json({message: err.sqlMessage})
                            console.log("Erreur lors de la suppression de la publication");
                        }
                        else{
                            res.status(200).json(results)
                            console.log("Publication supprimée avec succès !");
                        }
                    })
                }
                else if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(403).json({message: "You don't have the required permissions"})
                    console.log("Erreur d'authentification, vous n'avez pas les permissions requises")
                }
            }
            
        }
    })
}

exports.modify = (req,res,next) =>{
    const userId = misc.getUserId(req)
    const hasRights = misc.getRank(req)
    database.query('SELECT * FROM publications WHERE id=?', [req.params.publication_id], function(err, results, fields){
        if(results[0].users_id === userId || hasRights === 1){
            database.query('UPDATE `publications` SET title=?, image=?, content=? WHERE id=?',
            [req.body.title, req.body.image, req.body.content, req.params.publication_id], 
            function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                    console.log("Erreur lors de la modification de la publication");
                }
                else{
                    res.status(200).json(results)
                    console.log("Publication modifiée avec succès !");
                }
            })
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(403).json({message: "You don't have the required permissions"})
            console.log("Erreur d'authentification, vous n'avez pas les permissions requises");
        }  
    })  
}

exports.like = (req,res,next) =>{
    const userId = misc.getUserId(req)
    database.query('SELECT value FROM publications_votes WHERE users_id=? AND publications_id=?',[userId, req.params.publication_id], function(err, results, fields){
        if(results.length === 0){
            if(req.body.value !== -1){
                database.query('INSERT INTO publications_votes(users_id, publications_id, value)VALUES(?, ?, ?)',[userId, req.params.publication_id, req.body.value],
                function(err, results, fields){
                    
                    if(err){
                        return res.status(401).json({message: err.sqlMessage})
                    }
                    else if(req.body.value === 1){
                        database.query('UPDATE publications SET upvote=upvote + 1 WHERE id=?', [req.params.publication_id],function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json(results)
                            }
                        })
                    }
                    else if(req.body.value === 0){
                        database.query('UPDATE publications SET downvote=downvote + 1 WHERE id=?', [req.params.publication_id],function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json(results)
                            }
                        })
                    }
                    else{
                        return res.status(500).json({message: "Oops, something went wrong"})
                    }
                })
            }
            else{
                res.status(400).json({message: 'Vote non conforme'})
            }
            
        }
        else if(req.body.value === 1){
            if(results[0].value === 0){
                database.query('UPDATE publications_votes SET value=1 WHERE publications_id=?',[req.params.publication_id], function(err,results,fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE publications SET downvote=downvote - 1, upvote=upvote + 1 WHERE id=?', [req.params.publication_id],
                        function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json(results)
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
            if(results[0].value === 1){
                database.query('UPDATE publications_votes SET value=0 WHERE publications_id=?',[req.params.publication_id], function(err,results,fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE publications SET downvote=downvote + 1, upvote=upvote - 1 WHERE id=?', [req.params.publication_id],
                        function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json(results)
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
            return res.status(400).json({message: err.sqlMessage})
        }
        else if(req.body.value === -1){
            if(results[0].value === 0){
                database.query('DELETE FROM publications_votes WHERE publications_id=?',[req.params.publication_id], function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE publications SET downvote=downvote - 1 WHERE id=?', [req.params.publication_id],
                        function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json(results)
                            }
                        })
                    }
                })
            }
            else if(results[0].value === 1){
                database.query('DELETE FROM publications_votes WHERE publications_id=?',[req.params.publication_id], function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        database.query('UPDATE publications SET upvote=upvote - 1 WHERE id=?', [req.params.publication_id],
                        function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json(results)
                            }
                        })
                    }
                })
            }
        }
    })
}

exports.addFavorites = (req, res, next) => {
    const userId = misc.getUserId(req)
    database.query('SELECT * FROM favorites WHERE publications_id=? AND users_id=?', [req.params.publication_id, userId],
    function(err, results, fields){
        if(results.length === 0){
            {database.query('INSERT INTO favorites(publications_id, users_id)VALUES(?, ?)',[req.params.publication_id, userId], function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(201).json({message: "Added to bookmark"})
                }
            })}
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else if(results.length > 0){
            res.status(200).json({message: "Already bookmarked. Check profile to delete"})
        }
        else{
            res.status(500).json({message: 'Oops, something went wrong'})
        }
    })
    
}
