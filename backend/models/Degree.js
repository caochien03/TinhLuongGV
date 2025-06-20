const mongoose = require("mongoose");

const degreeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            comment: "Tên bằng cấp",
        },
        coefficient: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
            comment: "Hệ số theo bằng cấp",
        },
        shortName: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Degree", degreeSchema);
