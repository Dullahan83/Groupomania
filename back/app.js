const express = require ('express');
const mysql = require ('mysql2')
const path = require('path');
const cors = require('cors')

const userRoutes = require ('./routes/userConnection');
const publiRoutes = require('./routes/publications');
const commRoutes = require('./routes/comments')
const profileRoutes = require('./routes/userData')

const app = express();



//

app.use((req, res, next) => {
    // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // on indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // on autorise ce serveur à fournir des scripts pour la page visitée
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });

app.use(express.json());
app.use(cors());
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/profile', profileRoutes)
app.use('/api/publications', publiRoutes);
app.use('/api/publications', commRoutes)
module.exports = app;