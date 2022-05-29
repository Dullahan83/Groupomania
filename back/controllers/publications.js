const database = require('../util/database');
const misc = require('../util/functions')
const fs = require('fs');
const jsonWebToken= require ('jsonwebtoken');
const env = require('dotenv');


function getUserId(req){
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonWebToken.verify(token, process.env.jwtKey);
    const userId = decodedToken.userId;
    return userId;
}

exports.getAll = (req,res,next) =>{
    database.query('SELECT * FROM `publications`', function(err, results, fields){
        if (err) {
            console.log(err)
        }
        else{
            res.send(results)
        }
    })
}

exports.getOne = (req,res,next) =>{
    database.query('SELECT * FROM `publications` WHERE id=?',[req.params.id], function(err, results, fields){
        if (err) {
            console.log(err)
        }
        else{
            res.send(results[0])
        }
    })
}

exports.create = (req,res,next) =>{
    const formatDate = misc.formatDate()
    const userId = misc.getUserId(req)
    console.log(formatDate)
    const image = req.body.image;
    if(req.body.image !== undefined){
        const imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        if(req.body.content === undefined){
            database.query('INSERT INTO `publications`(`title`, `image`, `created_at`, `users_id`)values(?, ?, ?,?)',[req.body.title, image, formatDate, userId], function(err, results, fields){
                if(err){
                    console.log(err)
                    console.log("Erreur lors de la création de la publication");
                }
                else{
                    console.log(results)
                    console.log("Publication crée avec succès !");
                }
            });
        }
        else{
            database.query('INSERT INTO `publications`(`title`, `image`, `content`, `created_at`, `users_id`)values(?, ?, ?, ?, ?)',[req.body.title, image, formatDate, req.body.content, userId], function(err, results, fields){
                if(err){
                    console.log(err)
                    console.log("Erreur lors de la création de la publication");
                }
                else{
                    console.log(results)
                    console.log("Publication crée avec succès !");
                }
            });
        }
    }
    else{
        database.query('INSERT INTO `publications`(`title`, `content`, `created_at`, `users_id`)values(?, ?, ?, ?)',[req.body.title, req.body.content, formatDate, userId], function(err, results, fields){
            if(err){
                console.log(err)
                console.log("Erreur lors de la création de la publication");
            }
            else{
                console.log(results)
                console.log("Publication crée avec succès !");
            }
        });
    }
}

exports.delete = (req,res,next) =>{
    database.query('DELETE FROM `publications` WHERE id=?', [req.params.id], function(err, results, fields){
        const filename = results[0].image.split('/images/')[1];
        console.log(filename)
        fs.unlink(`images/${filename}`)
        if(err){
            console.log(err)
            console.log("Erreur lors de la suppression de la publication");
        }
        else{
            console.log(results)
            console.log("Publication supprimée avec succès !");
        }
    })
}

exports.modify = (req,res,next) =>{
    database.query('SELECT * FROM publications WHERE id=?',[req.params.id],function(err, results, fields){
        const id = results[0].users_id;
        const userId = getUserId(req)
        console.log(userId)
        if(id === userId){
            database.query('UPDATE `publications` SET title=?, image=?, content=? WHERE id=?',
            [req.body.title, req.body.image, req.body.content, req.params.id], 
            function(err, results, fields){
                if(err){
                    console.log(err)
                    console.log("Erreur lors de la modification de la publication");
                }
                else{
                    console.log("Publication modifiée avec succès !");
                    res.send(results)
                }
            })
        }
        else if(err){
            console.log(err)
        }
        else{
            console.log("Erreur d'authentification, impossible de modifier");
        }  
    })
    
}

exports.like = (req,res,next) =>{

}