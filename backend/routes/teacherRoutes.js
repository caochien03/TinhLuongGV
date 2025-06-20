const express = require("express");
const teacherController = require("../controllers/teacherController");
const router = express.Router();

// Tạo giáo viên mới
router.post("/", teacherController.createTeacher);

// Lấy danh sách giáo viên
router.get("/", teacherController.getTeachers);

// Lấy giáo viên theo ID
router.get("/:id", teacherController.getTeacherById);

// Cập nhật giáo viên
router.put("/:id", teacherController.updateTeacher);

// Xóa giáo viên
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
