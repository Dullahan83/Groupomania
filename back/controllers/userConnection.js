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
                    console.log(err)
                    console.log("Erreur lors de la création de l'utilisateur");
                }else{
                    console.log(results);
                    console.log("Utilisateur crée avec succés")
                }

            }
        )})
}

/* exports.get = (req, res, next) => {
    database.query('SELECT * FROM `users`',
    function(err, results, fields){
        if(!err){
            res.send(results)
        }else{
            console.log(err)
        }
    })
}
 */
exports.login = (req, res, next) =>{
    database.query('SELECT * FROM users WHERE email=?', [req.body.email], function(err, results, fields){
        if(results[0] !== undefined){
            bcrypt.compare(req.body.password, results[0].password)
            .then((valid) => {
                if(!valid){
                    return res.status(401).json({error: 'Mot de passe incorrect'})
                }
                res.status(201).json({
                    userId: results[0].id,
                    token: jsonWebToken.sign(
                        {userId: results[0].id},
                        process.env.jwtKey,
                        {expiresIn: "2h"}
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
        }
        else{
            console.log("Erreur: adresse mail non reconnue !")
        }
    })         
};
