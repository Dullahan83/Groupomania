const yup = require('yup')

let schema = yup.object().shape({
    Username: yup.string().required(),
    Email: yup.string().required().email(),
    Password: yup.string().required(),
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
  