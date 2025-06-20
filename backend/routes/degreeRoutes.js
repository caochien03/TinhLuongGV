const express = require("express");
const degreeController = require("../controllers/degreeController");
const router = express.Router();

// Tạo bằng cấp mới
router.post("/", degreeController.createDegree);

// Lấy danh sách bằng cấp
router.get("/", degreeController.getDegrees);

// Lấy bằng cấp theo ID
router.get("/:id", degreeController.getDegreeById);

// Cập nhật bằng cấp
router.put("/:id", degreeController.updateDegree);

// Xóa bằng cấp
router.delete("/:id", degreeController.deleteDegree);

module.exports = router;
