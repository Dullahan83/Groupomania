const database = require('../util/database')
const jsonWebToken = require('jsonwebtoken')
const misc = require('../util/functions')


exports.getProfile = (req, res, next) => {
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(400).json(results[0])
        }
    })
}

exports.getUserPosts = (req, res, next) => {
    let profileId
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            profileId = results[0].id
            console.log(profileId)
            database.query('SELECT publications.title, publications.image, publications.content, publications.created_at, users.username, users.avatar FROM publications INNER JOIN users ON publications.users_id=users.id WHERE users.id=?',
            [profileId],function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(200).json(results)
                }
            })
        }
    })
}

exports.getUserComments = (req, res, next) => {
    let profileId
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            profileId = results[0].id
            console.log(profileId)
            database.query('SELECT comments.content FROM comments INNER JOIN users ON comments.users_id=users.id WHERE users.id=?',
            [profileId],function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(200).json(results)
                }
            })
        }
    })
}

exports.getUserFavorites = (req, res, next) => {
    let profileId
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            profileId = results[0].id
            console.log(profileId)
            database.query('SELECT * from publications INNER JOIN favorites ON favorites.publications_id=publications.id WHERE favorites.users_id=?',
            [profileId],function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(200).json(results)
                }
            })
        }
    })
}



exports.modifyProfile = (req, res, next) => {
    database.query('SELECT * FROM users WHERE username=?', [req.params.username], function(err, results, fields){
        let profileId = results[0].id
        const userId = misc.getUserId(req);
        if(profileId === userId){
            database.query('UPDATE users SET avatar=?, firstname=?, lastname=?, presentation=? WHERE id=?',
            [req.body.avatar, req.body.firstname, req.body.lastname, req.body.presentation, profileId],
            function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    console.log("Profil modifié avec succès !")
                    res.status(200).json({message: "Successfully modified !"})
                }
            })
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(403).json({message: "You don't have the permissions"})
            console.log("Erreur d'authentification, vous n'avez pas les permissions requises");
        }
    })
}

exports.deleteProfile = (req, res, next) => {
    database.query('SELECT * FROM users WHERE username=?', [req.params.username], function(err, results, fields){
        let profileId = results[0].id
        const userId = misc.getUserId(req);
        if(profileId === userId){
            database.query('DELETE FROM users WHERE id=?', [userId], function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                    console.log("Echec de la suppression du profil");
                }
                else{
                    res.status(200).json({message: "Successfully deleted !"})
                    console.log("Suppression du profil effectuée !");
                }
            })
        }
        else if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(403).json({message: "You don't have the permissions"});
        }
    })
}

exports.getUserFriendlist = (req, res, next) => {
    let profileId
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            profileId = results[0].id
            console.log(profileId)
            database.query('SELECT users.username from users INNER JOIN friendlist ON friendlist.friend_id=users.id WHERE friendlist.users_id=?',
            [profileId],function(err, results, fields){
                if(err){
                    res.status(400).json({message: err.sqlMessage})
                }
                else{
                    res.status(200).json(results)
                }
            })
        }
    })
}

exports.addFriend= (req, res, next) => {
    const userId= misc.getUserId(req)
    database.query('INSERT INTO friendlist(users_id, friend_id)VALUES(?, ?)',[userId, req.body.friend_id], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(200).json({message: "Friend request sent"})
        }
    })
}

exports.deleteFriend = (req, res, next) => {
    const userId = misc.getUserId(req)
    database.query('DELETE FROM friendlist WHERE friendlist.friend_id=?', [userId], function(err, results, fields){
        if(err){
            res.status(400).json({message: err.sqlMessage})
        }
        else{
            res.status(200).json({message: "Successfully deleted !"})
        }
    })
}