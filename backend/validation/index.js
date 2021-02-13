const { validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);

  console.log(errors);
  if (!errors.isEmpty()) {
    //init error array
    const error = [];
    //push errors to array
    errors.array().forEach((err) => {
      error.push(err.msg);
    });
    //return errors array
    return res.status(422).json({ error });
  }
  next();
};
