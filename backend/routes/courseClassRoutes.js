const express = require("express");
const courseClassController = require("../controllers/courseClassController");
const router = express.Router();

// Tạo lớp học phần mới
router.post("/", courseClassController.createCourseClass);

// Lấy danh sách lớp học phần
router.get("/", courseClassController.getCourseClasses);

// Lấy lớp học phần theo ID
router.get("/:id", courseClassController.getCourseClassById);

// Cập nhật lớp học phần
router.put("/:id", courseClassController.updateCourseClass);

// Xóa lớp học phần
router.delete("/:id", courseClassController.deleteCourseClass);

// Statistics routes
router.get(
    "/stats/semester/:semesterId",
    courseClassController.getStatsBySemester
);
router.get("/stats/year/:year", courseClassController.getStatsByYear);

module.exports = router;
