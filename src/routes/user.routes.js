const { Router } = require('express')

const router = Router()
const db = require("../controller/user.controller.js");

router.get("/users", db.getUsers);
router.get("/user", db.getUserProfile);
router.post("/create-user", db.registerUser);
router.put("/update-user", db.updateUserProfile);
router.delete("/delete-user", db.deleteUser);

module.exports = router