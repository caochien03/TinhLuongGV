const express = require("express");
const semesterController = require("../controllers/semesterController");
const router = express.Router();

// Tạo kỳ học mới
router.post("/", semesterController.createSemester);

// Lấy danh sách kỳ học
router.get("/", semesterController.getSemesters);

// Lấy kỳ học theo ID
router.get("/:id", semesterController.getSemesterById);

// Cập nhật kỳ học
router.put("/:id", semesterController.updateSemester);

// Xóa kỳ học
router.delete("/:id", semesterController.deleteSemester);

module.exports = router;
