const { Router } = require('express');
const router = Router();
const db = require("../controller/user.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js")

router.get("/users", db.getUsers);
router.get("/user", authMiddleware, db.getUserProfile);
router.post("/create-user", db.registerUser);
router.put("/update-user", db.updateUserProfile);

module.exports = router;
