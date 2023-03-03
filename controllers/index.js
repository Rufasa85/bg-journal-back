const express = require('express');
const router = express.Router();

const userRoutes = require("./userController")
router.use("/api/users",userRoutes)

const playRoutes = require("./playController")
router.use("/api/plays",playRoutes)


module.exports = router;