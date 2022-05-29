const jsonWebToken= require ('jsonwebtoken');
const env = require('dotenv')

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jsonWebToken.verify(token, process.env.jwtKey);
        const userId = decodedToken.userId;
        req.auth = {userId};
        if(req.body.userId && req.body.userId !== userId){
            console.log("test pas bon")
            throw  Error("User ID non valable !");
        }
        else{
            next();
            console.log("test ok")
        }
    }
    catch(error){
        res.status(401).json({error: error} | "Requête non authentifiée !")
    }
}