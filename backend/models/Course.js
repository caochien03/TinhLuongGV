const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        credits: { type: Number, required: true },
        coefficient: { type: Number, required: true },
        totalLessons: { type: Number, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
