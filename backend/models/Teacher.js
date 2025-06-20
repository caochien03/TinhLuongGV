const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true }, // mã số
        name: { type: String, required: true }, // họ tên
        dob: { type: Date, required: true }, // ngày sinh
        phone: { type: String },
        email: { type: String },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        degree: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Degree",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
