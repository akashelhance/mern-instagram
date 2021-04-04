const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const requiredLoggin = require("../middleware/requiredLogin")


// Load env vars
dotenv.config({ path: './config/config.env' });

const jwtkey  = "" + process.env.JWT_KEY


router.get("/pro",requiredLoggin,  (req, res) => {
  res.json({ message: "Hello we are getting the data" });
});

router.post(
  "/signup",
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //see if user alredy exit or not
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //Encryt password:

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return jsonwebtoke
      res.send(user);
    } catch (err) {
      console.log(err.message);
      res.send("Server Error");
    }

    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.password);
    res.status(200).json({ message: "reee" });
  }
);

router.post(
  "/signin",
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res
        .status(422)
        .json({ message: "The user or password is invalid" });
    } else {
        //reult is going to hold the boolean value:
        let result = bcrypt.compareSync(password, user.password);
        if(result){
            const token= jwt.sign({_id: user._id}, jwtkey)
            res.json(token)  
        }
        else{
            return res.status(422).json({"message": "The user or password is invalid"})
        }
        
    }

    res.send("done");
  }
);

module.exports = router;
