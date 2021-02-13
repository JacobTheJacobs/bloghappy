const express = require("express");
const router = express.Router();
// validators
const { runValidation } = require("../validation");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validation/auth");
//models
const User = require("../models/user");
const shortId = require("shortid");
//jwt
const jwt = require("jsonwebtoken");

//@@@SIGNUP
//@@@localhost:3000/signup
//@@@POST
router.post("/signup", userSignupValidator, runValidation, (req, res) => {
  //
  //check if user exists
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    //init new user
    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({ name, email, password, profile, username });

    //save user to db
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      // res.json({
      //     user: success
      // });
      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
});

//@@@SIGNIN
//@@@localhost:3000/signin
//@@@POST
router.post("/signin", userSigninValidator, runValidation, (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match.",
      });
    }
    // generate a token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expiresIn: "1d" });
    const { _id, username, name, email, role } = user;
    return res.json({
      error: "",
      token,
      user: { _id, username, name, email, role },
    });
  });
});

//@@@SIGNOUT
//@@@localhost:3000/signout
//@@@GET
router.get("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
});

module.exports = router;
