const mongoose = require("mongoose");

const duplicateCheck = async function (model, field, value, idToExclude) {
    const query = { [field]: { $regex: new RegExp(`^${value}$`, "i") } };
    if (idToExclude) {
        query._id = { $ne: idToExclude };
    }
    const existing = await model.findOne(query);
    return existing;
};

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
        name: {
            type: String,
            required: [true, "Tên lớp học phần là bắt buộc."],
        },
        studentCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

courseClassSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const existing = await duplicateCheck(
            this.constructor,
            "name",
            this.name,
            this._id
        );
        if (existing) {
            return next(
                new Error(`Tên lớp học phần "${this.name}" đã tồn tại.`)
            );
        }
    }
    next();
});

courseClassSchema.pre("findOneAndUpdate", async function (next) {
    const docToUpdate = this.getUpdate();
    if (docToUpdate.name) {
        const existing = await duplicateCheck(
            this.model,
            "name",
            docToUpdate.name,
            this.getQuery()._id
        );
        if (existing) {
            return next(
                new Error(`Tên lớp học phần "${docToUpdate.name}" đã tồn tại.`)
            );
        }
    }
    next();
});

module.exports = mongoose.model("CourseClass", courseClassSchema);
