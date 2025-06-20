const express = require("express");
const departmentController = require("../controllers/departmentController");
const router = express.Router();

// Tạo khoa mới
router.post("/", departmentController.createDepartment);

// Lấy danh sách khoa
router.get("/", departmentController.getDepartments);

// Lấy khoa theo ID
router.get("/:id", departmentController.getDepartmentById);

// Cập nhật khoa
router.put("/:id", departmentController.updateDepartment);

// Xóa khoa
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
