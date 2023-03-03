const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Play } = require("../models");
const jwt = require("jsonwebtoken");

// signup
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  })
    .then((newUser) => {
      const token = jwt.sign(
        {
          username: newUser.username,
          id: newUser.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "6h",
        }
      );
      res.json({
        token,
        user: newUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
});
// login
router.post("/login", (req, res) => {
  //1. find the user
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((foundUser) => {
      //is email wrong?
      if (!foundUser) {
        return res.status(401).json({ msg: "invalid login credentials" });
      }
      //is password wrong
      if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
        return res.status(401).json({ msg: "invalid login credentials" });
      }
      //at this point, we know email and password are correct
      const token = jwt.sign(
        {
          username: foundUser.username,
          id: foundUser.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "6h",
        }
      );
      res.json({
        token,
        user: foundUser,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
});

router.get("/isValidToken", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ isValid: false, msg: "you must be logged in to create a play!" });
  }
  try {
    const tokenData = jwt.verify(token,process.env.JWT_SECRET);
    res.json({
      isValid: true,
      user: tokenData,
    });
  } catch (err) {
    res.status(403).json({
      isValid: false,
      msg: "invalid token",
    });
  }
});
// get one with plays
router.get("/:id", (req, res) => {
  User.findByPk(req.params.id, {
    include: [Play],
  })
    .then((userData) => {
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: "oh no", err });
    });
});

module.exports = router;
