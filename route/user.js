const express = require('express');
const userController = require("../controller/user");
const router = express.Router();

router.post("/signup", userController.postSignUp);

router.post("/signin", userController.postSignIn);



module.exports = router;