const express = require("express");
const courseController = require("../controllers/courseController");
const router = express.Router();

// Tạo học phần mới
router.post("/", courseController.createCourse);

// Lấy danh sách học phần
router.get("/", courseController.getCourses);

// Lấy học phần theo ID
router.get("/:id", courseController.getCourseById);

// Cập nhật học phần
router.put("/:id", courseController.updateCourse);

// Xóa học phần
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
