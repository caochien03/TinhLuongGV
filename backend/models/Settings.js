const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        baseRate: {
            type: Number,
            required: true,
            min: 0,
            comment: "Định mức tiền cho một tiết chuẩn (VNĐ)",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Settings", settingsSchema);
