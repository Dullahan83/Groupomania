const yup = require('yup')

let schema = yup.object().shape({
    Email: yup.string().required(),
    Password: yup.string().required(),
  })

module.exports = (req, res, next) => {
  schema
  .validate({
    Email: req.body.email,
    Password: req.body.password,
  }).then(function(valid){
      next()
  }).catch(function(err){
    res.status(400).json({message: err.errors})
  })
}