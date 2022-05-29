const jsonWebToken = require('jsonwebtoken')
const env = require('dotenv').config()

exports.formatDate = () => {
    const fullDate = new Date();
    const year = fullDate.getFullYear();
    const month = fullDate.getMonth() + 1;
    const days = fullDate.getDate();
    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();
    const seconds = fullDate.getSeconds();
    return `${year}-${month}-${days} ${hours}:${minutes}:${seconds}`
}

exports.getUserId = (req) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonWebToken.verify(token, process.env.jwtKey);
    const userId = decodedToken.userId;
    return userId;
}