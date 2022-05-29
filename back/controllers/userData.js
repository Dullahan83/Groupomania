const database = require('../util/database')
const jsonWebToken = require('jsonwebtoken')
const misc = require('../util/functions')


exports.getProfile = (req, res, next) => {
    database.query('SELECT * FROM `users` WHERE username=?',[req.params.username], function(err, results, fields){
        if(err){
            console.log(err)
        }
        else{
            res.send(results[0])
        }
    })
}

exports.getUserPosts = (req, res, next) => {
    
}

exports.getUserComments = (req, res, next) => {
    
}

exports.getUserFavorites = (req, res, next) => {
    
}

exports.getUserFriendlist = (req, res, next) => {
    
}

exports.modifyProfile = (req, res, next) => {
    database.query('UPDATE users SET avatar=?, firstname=?, lastname=?, presentation=?',
    [req.body.avatar, req.body.firstname, req.body.lastname, req.body.presentation],
    function(err, results, fields){
        if(err){
            console.log(err)
        }
        else{
            console.log("Profil modifié avec succès !")
            res.send(results)
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
                    console.log(err)
                    console.log("Echec de la suppression du profil");
                }
                else{
                    res.send(results)
                    console.log("Suppression du profil effectuée !");
                }
            })
        }
        else if(err){
            console.log(err)
        }
        else{
            console.log("Suppression du profil échouée, erreur de permissions");
        }
    })
}

exports.addFriend= (req, res, next) => {
    
}

exports.deleteFriend = (req, res, next) => {
    
}