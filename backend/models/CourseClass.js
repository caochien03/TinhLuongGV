const mongoose = require("mongoose");

const courseClassSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            comment: "Tham chiếu đến môn học",
        },
        semester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Semester",
            required: true,
            comment: "Tham chiếu đến kỳ học",
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
            comment: "Tham chiếu đến giảng viên",
        },
        type: {
            type: String,
            enum: ["normal", "special", "international"],
            default: "normal",
            comment: "Loại lớp: thường, chất lượng cao, quốc tế",
        },
        coefficient: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
            comment: "Hệ số lớp",
        },
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        studentCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Đảm bảo mỗi giảng viên chỉ dạy một lớp của một môn trong một kỳ
courseClassSchema.index(
    { course: 1, semester: 1, teacher: 1 },
    { unique: true }
);

module.exports = mongoose.model("CourseClass", courseClassSchema);
