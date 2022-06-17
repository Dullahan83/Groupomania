const jsonWebToken= require ('jsonwebtoken');
const env = require('dotenv')

module.exports = (req, res, next) => {
    try{
        console.log(req.headers)
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decodedToken = jsonWebToken.verify(token, process.env.jwtKey);
        const userId = decodedToken.userId;
        req.auth = {userId};
        if(req.body.userId && req.body.userId !== userId || req.body.users_id && req.body.users_id !== userId){
            console.log('Pas authentifié')
            throw  Error("User ID non valable !");
        }
        else{
            console.log('Authentifié')
            next();
        }
    }
    catch(error){
        console.log("Ça plante à l'auth")
        res.status(401).json({error: error} | "Requête non authentifiée !")
    }
}