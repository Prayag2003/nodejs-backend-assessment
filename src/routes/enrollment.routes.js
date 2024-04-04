const { Router } = require('express');
const { getEnrolledCoursesForUser, enrollUserInCourse } = require('../controller/enrollment.controller');
const router = Router();

router.get("/get-enrolled-courses/:id", getEnrolledCoursesForUser)
router.post("/enroll-course", enrollUserInCourse)

module.exports = router