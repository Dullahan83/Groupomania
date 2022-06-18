const bcrypt= require ("bcrypt");
const jsonWebToken= require ("jsonWebToken");
const database = require('../util/database');
const env = require('dotenv').config();



exports.signup = (req, res, next) =>{
    bcrypt.hash(req.body.password, 12)
    .then((hash) =>{
        database.query('INSERT INTO `users`(`username`,`email`,`password`) VALUES(?, ? , ?)', [req.body.username, req.body.email, hash],
            function(err, results, fields){
                if(err){
                    if(err.errno === 1048){
                        return res.status(400).json({message: err.sqlMessage})
                    }
                    else if(err.errno === 1062){
                        return res.status(409).json({message: err.sqlMessage})
                    }
                    else{
                        return res.status(500).json({message: "Aie, aie, aie ... Il y a eu une couille dans le potage"})
                    }
                }else{
                    return res.status(200).json({message: "Utilisateur crée avec succès"})
                }
            }
    )})
}


exports.login = (req, res, next) =>{
    database.query('SELECT * FROM users WHERE email=?', [req.body.email], function(err, results, fields){
        if(results[0] !== undefined){
            bcrypt.compare(req.body.password, results[0].password)
            .then((valid) => {
                if(!valid){
                    return res.status(401).json({error: 'Mot de passe incorrect'})
                }
                res.status(201).json({
                    token: jsonWebToken.sign(
                        {userId: results[0].id,username: results[0].username, perm: results[0].has_rights},
                        process.env.jwtKey,
                        {expiresIn: "2h"}
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
        }
        else{
            return res.status(404).json({message: "Adresse mail non reconnue, peut être une faute de frappe ? "})
        }
    })         
};
