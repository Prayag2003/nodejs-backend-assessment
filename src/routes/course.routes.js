const { Router } = require('express');
const router = Router();
const sa = require("../controller/superadmin.controller.js");
const getCoursesController = require("../controller/course.controller.js")

router.get("/courses", sa.getAllCoursesBySuperadmin);
router.post("/create-course", sa.createCourseBySuperadmin);
router.put("/update-course/:id", sa.updateCourseBySuperadmin);
router.delete("/delete-course/:id", sa.deleteCourseBySuperadmin);

router.get("/get-courses", getCoursesController.getCourses)

module.exports = router;
