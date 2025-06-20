require("dotenv").config();
const express = require("express");
const cors = require("cors");
const teacherRoutes = require("./routes/teacherRoutes");
const degreeRoutes = require("./routes/degreeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const courseClassRoutes = require("./routes/courseClassRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Định nghĩa route mẫu
app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/teachers", teacherRoutes);
app.use("/api/degrees", degreeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/course-classes", courseClassRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
