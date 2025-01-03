const express = require('express');
const router = express.Router();
const {getallusers} = require("../controllers/admincontrollers.js");

router.get("/getallusers", getallusers); // Route for getting all users

module.exports = router;