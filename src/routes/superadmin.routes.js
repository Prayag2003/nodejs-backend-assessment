const { Router } = require('express');
const router = Router();

const authMiddleware = require("../middleware/auth.middleware.js")
const createSuperAdmin = require("../controller/createSuperAdmin.controller.js")

router.put("/users/:id/promote-superadmin", authMiddleware, createSuperAdmin);

module.exports = router