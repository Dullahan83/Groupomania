const jsonWebToken= require ('jsonwebtoken');
const env = require('dotenv')

module.exports = (req, res, next) => {
    try{
        console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token:"+ token);
        const decodedToken = jsonWebToken.verify(token, process.env.jwtKey);
        console.log(decodedToken);
        const userId = decodedToken.userId;
        console.log("userID:"+  userId);
        req.auth = {userId};
        console.log(req.body)
        if(req.body.userId && req.body.userId !== userId || req.body.users_id && req.body.users_id !== userId){
            console.log("Authentification pas ok");
            throw  Error("User ID non valable !");
        }
        else{
            console.log('Authentification ok')
            next();
        }
    }
    catch(error){
        console.log("ça vient d'ici")
        res.status(401).json({error: error} | "Requête non authentifiée !")
    }
}