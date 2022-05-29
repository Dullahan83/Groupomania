const multer = require("multer");

//Créé une map permettant de récuperer l'extension de fichier d'une image
const MIME_TYPES = {
  "image/jpg" : "jpg",
  "image/jpeg": "jpg",
  "image/png" : "png",
  "image/bmp" : ".bmp",
  "image/tiff": ".tif",
  "image/tiff": ".tiff",
  "image/webp": ".webp",
  "image/gif" : ".gif" 
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {    // Créé un nom de fichier unique pour pouvoir stocker l'image
    const name = file.originalname.split(" ").join("_"); // change le format du nom
    const extension = MIME_TYPES[file.mimetype]; // récupère l'extension
    callback(null, name + Date.now() + "." + extension); // renvoie le nouveau nom en ajoutant la date et l'extension
  },
});

module.exports = multer({ storage }).single("image"); //appelle la méthode multer en indiquant que c'est un seul fichier image