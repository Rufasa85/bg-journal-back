const express = require("express");
const router = express.Router();
const { Play, User } = require("../models");
const jwt = require("jsonwebtoken");

//find all with user
router.get("/", (req, res) => {
  Play.findAll({
    include: [User],
  })
    .then((allPlays) => {
      res.json(allPlays);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "womp womp womp",
        err,
      });
    });
});
// create PROTECTED
router.post("/", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to create a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Play.create({
      title: req.body.title,
      date: req.body.date,
      notes: req.body.notes,
      isWin: req.body.isWin,
      score: req.body.score,
      UserId: tokenData.id,
    })
      .then((newPlay) => {
        res.json(newPlay);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          msg: "womp womp womp",
          err,
        });
      });
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});
// edit one PROTECTED
router.put("/:playId", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to edit a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Play.findByPk(req.params.playId)
      .then((foundPlay) => {
        if (!foundPlay) {
          return res.status(404).json({ msg: "no such play!" });
        }
        if (foundPlay.UserId !== tokenData.id) {
          return res
            .status(403)
            .json({ msg: "you can only edit plays you created!" });
        }
        Play.update(
          {
            title: req.body.title,
            date: req.body.date,
            notes: req.body.notes,
            isWin: req.body.isWin,
            score: req.body.score,
          },
          {
            where: {
              id: req.params.playId,
            },
          }
        )
          .then((delPlay) => {
            res.json(delPlay);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "womp womp womp",
              err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          msg: "womp womp womp",
          err,
        });
      });
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});
// delete one PROTECTED
router.delete("/:playId", (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ msg: "you must be logged in to delete a play!" });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    Play.findByPk(req.params.playId)
      .then((foundPlay) => {
        if (!foundPlay) {
          return res.status(404).json({ msg: "no such play!" });
        }
        if (foundPlay.UserId !== tokenData.id) {
          return res
            .status(403)
            .json({ msg: "you can only delete plays you created!" });
        }
        Play.destroy({
          where: {
            id: req.params.playId,
          },
        })
          .then((delPlay) => {
            res.json(delPlay);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "womp womp womp",
              err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          msg: "womp womp womp",
          err,
        });
      });
  } catch (err) {
    return res.status(403).json({ msg: "invalid token" });
  }
});

module.exports = router;
