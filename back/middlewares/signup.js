const yup = require('yup')

let schema = yup.object().shape({
    Username: yup
    .string()
    .required()
    .max(15,`Le nom d'utilisateur ne doit pas dépasser 15 caractère`)
    .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s'.-]+$/,`Le nom d'utilisateur peux contenir des majuscules et des minuscules`),
    Email: yup
    .string()
    .required()
    .email(),
    Password: yup
    .string()
    .required()
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
  