const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");
const Teacher = require("../models/Teacher");
const CourseClass = require("../models/CourseClass");
const Semester = require("../models/Semester");
const Department = require("../models/Department");
const paymentController = require("../controllers/paymentController");

// Lấy định mức tiền hiện tại
router.get("/settings/payment-rate", paymentController.getPaymentRate);

// Cập nhật định mức tiền
router.put("/settings/payment-rate", paymentController.updatePaymentRate);

// Tính tiền dạy cho một giảng viên trong một kỳ
router.get(
    "/calculate/:teacherId/:semesterId",
    paymentController.calculateTeacherPayment
);

// Tính tiền dạy cho tất cả giảng viên trong một kỳ
router.get(
    "/calculate-semester/:semesterId",
    paymentController.calculateSemesterPayments
);

// UC4.1. Báo cáo tiền dạy của giáo viên trong một năm
router.get("/report/year/:year", paymentController.reportYear);

// UC4.2. Báo cáo tiền dạy của giáo viên một khoa
router.get(
    "/report/department/:departmentId",
    paymentController.reportDepartment
);

// UC4.3. Báo cáo tiền dạy của giáo viên toàn trường
router.get("/report/school", paymentController.reportSchool);

module.exports = router;
