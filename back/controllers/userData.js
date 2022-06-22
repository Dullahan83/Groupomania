const database = require('../util/database')
const jsonWebToken = require('jsonwebtoken')
const misc = require('../util/functions')
const fs = require('fs');

exports.getProfile = (req, res, next) => {
    database.query('SELECT id,username, avatar, presentation, firstname, lastname FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            return res.status(200).json(results[0])
        }
    })
}

exports.getUserPosts = (req, res, next) => {
    let profileId
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            profileId = results[0].id
            database.query('SELECT p.*, u.username, u.avatar FROM publications as p INNER JOIN users as u ON p.users_id=u.id WHERE u.id=?',
            [profileId],function(err, results, fields){
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



exports.getUserFavorites = (req, res, next) => {
    let profileId
    database.query('SELECT id FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            profileId = results[0].id
            database.query('SELECT p.*, u.username from publications as p INNER JOIN favorites as f ON f.publications_id=p.id INNER JOIN users as u ON p.users_id=u.id WHERE f.users_id=?',
            [profileId],function(err, results, fields){
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



exports.modifyProfile = (req, res, next) => {
    database.query('SELECT * FROM users WHERE username=?', [req.params.username], function(err, results, fields){
        let profileId = results[0].id
        const prevImgUrl = results[0].avatar
        const userId = misc.getUserId(req);
        if(req.file !== undefined){
            const imgUrl = `images/${req.file.filename}`;
            if(profileId === userId){
                database.query('UPDATE users SET avatar=?, firstname=?, lastname=?, presentation=? WHERE id=?',
                [imgUrl, req.body.firstname, req.body.lastname, req.body.presentation, profileId],
                function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        if(prevImgUrl && prevImgUrl !=='images/DefaultProfil.jpg'){
                            if(fs.existsSync(prevImgUrl)){
                            fs.unlinkSync(prevImgUrl)
                        }
                        }
                        return res.status(200).json({message: "Modification effectuée !"})
                    }
                })
            }
            else if(err){
                return res.status(400).json({message: err.sqlMessage})
            }
            else{
                return res.status(403).json({message: "Vous n'avez pas les droits d'effectuer cette action !"})
            }
        }
        else if(prevImgUrl && req.file === undefined){
            if(profileId === userId){
                database.query('UPDATE users SET avatar=?, firstname=?, lastname=?, presentation=? WHERE id=?',
                [prevImgUrl, req.body.firstname, req.body.lastname, req.body.presentation, profileId],
                function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{
                        return res.status(200).json({message: "Modification effectuée !"})
                    }
                })
            }
            else if(err){
                return res.status(400).json({message: err.sqlMessage})
            }
            else{
                return res.status(403).json({message: "Vous n'avez pas les droits d'effectuer cette action !"})
            }
        }
        else if(req.file === undefined){
            const imgUrl = `images/DefaultProfil.jpg`;
            if(profileId === userId){
                database.query('UPDATE users SET avatar=?, firstname=?, lastname=?, presentation=? WHERE id=?',
                [imgUrl, req.body.firstname, req.body.lastname, req.body.presentation, profileId],
                function(err, results, fields){
                    if(err){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else{

                        return res.status(200).json({message: "Modification effectuée !"})
                    }
                })
            }
            else if(err){
                return res.status(404).json({message: err.sqlMessage})
            }
            else{
                return res.status(403).json({message: "Vous n'avez pas les droits d'effectuer cette action !"})
            }
        }
        else if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            return res.status(500).json({message: err.sqlMessage})
        }
        
    })
}

exports.deleteProfile = (req, res, next) => {
    database.query('SELECT * FROM users WHERE username=?', [req.params.username], function(err, results, fields){
        let profileId = results[0].id
        const userId = misc.getUserId(req);
        const imgPath = results[0].avatar
        if(profileId === userId){
            database.query('DELETE FROM users WHERE id=?', [userId], function(err, results, fields){
                if(err){
                    return res.status(400).json({message: err.sqlMessage})
                }
                else{
                    if(imgPath != undefined && imgPath !== 'images/DefaultProfil.jpg'){
                        if(fs.existsSync(imgPath)){
                            fs.unlinkSync(imgPath)
                        }
                    }
                    
                    return res.status(200).json({message: "Supprimé avec succès"})
                }
            })
        }
        else if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            return res.status(403).json({message: "Vous n'avez pas les droits d'effectuer cette action !"});
        }
    })
}

exports.getUserFollowed = (req, res, next) => {
    let profileId
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            profileId = results[0].id
            database.query('SELECT u.username, f.id from users as u INNER JOIN follows as f ON f.followed_id=u.id  WHERE f.users_id=?',
            [profileId],function(err, results, fields){
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

exports.Follow= (req, res, next) => {
    let profileId
    const userId= misc.getUserId(req)
    database.query('SELECT id FROM users WHERE username=?',[req.params.username], function(err, results, fiels){
        if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else if(results.length > 0){
            profileId = results[0].id
            if(userId != profileId){
                database.query('SELECT * FROM follows WHERE users_id=? AND followed_id=?',[userId, profileId], function(err,results, fields){
                    if(err){
                    return res.status(400).json({message: err.sqlMessage})
                    }
                    else if(results.length === 0){
                        database.query('INSERT INTO follows(users_id, followed_id)VALUES(?, ?)',[userId, profileId], function(err, results, fields){
                            if(err){
                                return res.status(400).json({message: err.sqlMessage})
                            }
                            else{
                                return res.status(200).json({message: "Stalker c'est mal vous savez ?!"})
                            }
                        })
                    }
                    else if(results.length > 0){
                        return res.status(200).json({message: "Vous stalkez déjà cette personne !"})
                    }
                    else{
                        return res.status(500).json({message: "Aie, aie, aie .... Il y a une couille dans le potage"})
                    }
                })
            }
        }
        else{
            res.status(404).json({message: 'Utilisateur inexistant'})
        }
    })
}

exports.Unfollow = (req, res, next) => {
    let profileId
    const userId = misc.getUserId(req)
    database.query('SELECT id FROM users WHERE username=?',[req.params.username], function(err, results, fiels){
        if(err){
            return res.status(404).json({message: "Cet utilisateur n'a pas été trouvé"})
        }
        else{
            profileId = results[0].id
            database.query('DELETE FROM follows WHERE follows.followed_id=? AND users_id=?', [profileId, userId], function(err, results, fields){
                if(err){
                    return res.status(400).json({message: err.sqlMessage})
                }
                else{
                    return res.status(200).json({message: "Vous ne stalkez plus cette personne"})
                }
            })
        }
    })
}