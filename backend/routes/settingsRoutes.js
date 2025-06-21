const express = require("express");
const settingsController = require("../controllers/settingsController");
const router = express.Router();

// Lấy cài đặt hiện tại
router.get("/", settingsController.getSettings);

// Cập nhật cài đặt
router.put("/", settingsController.updateSettings);

// Cập nhật hệ số cho tất cả lớp học phần
router.post("/update-coefficients", settingsController.updateAllCoefficients);

// Backward compatibility routes
router.get("/payment-rate", settingsController.getPaymentRate);
router.put("/payment-rate", settingsController.updatePaymentRate);

module.exports = router;
