const yup = require('yup')

let schema = yup.object().shape({
    Username: yup
    .string()
    .required("Va falloir le choisir ce pseudo")
    .max(15,`Le nom d'utilisateur ne doit pas dépasser 15 caractère`)
    .matches(/^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s'.-]+$/,`Le nom d'utilisateur peux contenir des majuscules, des minuscules et des chiffres`),
    Email: yup
    .string()
    .required("Il va nous falloir une adresse mail, quand même ...")
    .email()
    .min(6,'Une adresse mail aussi courte, vraiment ?'),
    Password: yup
    .string()
    .required("Et le mot de passe, faudrait pas l'oublier")
    .min(6,'Le mot de passe doit faire 6 caractère minimum')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins 1 majuscule')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins 1 minuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins 1 chiffre'),
  })

module.exports = (req, res, next) => {
  schema
  .validate({
    Username: req.body.username,
    Email: req.body.email,
    Password: req.body.password,
  }).then(function(valid){
      next()
  }).catch(function(err){
    res.status(400).json({message: err.errors})
  })
}
  