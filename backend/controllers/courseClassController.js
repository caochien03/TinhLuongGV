const CourseClass = require("../models/CourseClass");
const mongoose = require("mongoose");

exports.createCourseClass = async (req, res) => {
    try {
        const courseClass = new CourseClass(req.body);
        await courseClass.save();
        res.status(201).json(courseClass);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCourseClasses = async (req, res) => {
    try {
        const courseClasses = await CourseClass.find()
            .populate("course", "code name credits coefficient totalLessons")
            .populate("semester", "name year startDate endDate")
            .populate("teacher", "code name");
        res.json(courseClasses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCourseClassById = async (req, res) => {
    try {
        const courseClass = await CourseClass.findById(req.params.id)
            .populate("course", "code name credits coefficient totalLessons")
            .populate("semester", "name year startDate endDate")
            .populate("teacher", "code name");
        if (!courseClass) return res.status(404).json({ error: "Not found" });
        res.json(courseClass);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCourseClass = async (req, res) => {
    try {
        const courseClass = await CourseClass.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("course", "code name credits coefficient totalLessons")
            .populate("semester", "name year startDate endDate")
            .populate("teacher", "code name");
        if (!courseClass) return res.status(404).json({ error: "Not found" });
        res.json(courseClass);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCourseClass = async (req, res) => {
    try {
        const courseClass = await CourseClass.findByIdAndDelete(req.params.id);
        if (!courseClass) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thống kê số lớp mở theo học phần và kỳ học
exports.getStatsBySemester = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const stats = await CourseClass.aggregate([
            {
                $match: {
                    semester: mongoose.Types.ObjectId(semesterId),
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            {
                $unwind: "$courseInfo",
            },
            {
                $group: {
                    _id: "$course",
                    courseName: { $first: "$courseInfo.name" },
                    courseCode: { $first: "$courseInfo.code" },
                    totalClasses: { $sum: 1 },
                    totalStudents: { $sum: "$studentCount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id",
                    courseName: 1,
                    courseCode: 1,
                    totalClasses: 1,
                    totalStudents: 1,
                },
            },
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thống kê số lớp mở theo năm học
exports.getStatsByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const stats = await CourseClass.aggregate([
            {
                $lookup: {
                    from: "semesters",
                    localField: "semester",
                    foreignField: "_id",
                    as: "semesterInfo",
                },
            },
            {
                $unwind: "$semesterInfo",
            },
            {
                $match: {
                    "semesterInfo.year": year,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            {
                $unwind: "$courseInfo",
            },
            {
                $group: {
                    _id: {
                        course: "$course",
                        semester: "$semester",
                    },
                    courseName: { $first: "$courseInfo.name" },
                    courseCode: { $first: "$courseInfo.code" },
                    semesterName: { $first: "$semesterInfo.name" },
                    totalClasses: { $sum: 1 },
                    totalStudents: { $sum: "$studentCount" },
                },
            },
            {
                $group: {
                    _id: "$_id.course",
                    courseName: { $first: "$courseName" },
                    courseCode: { $first: "$courseCode" },
                    semesters: {
                        $push: {
                            semesterName: "$semesterName",
                            totalClasses: "$totalClasses",
                            totalStudents: "$totalStudents",
                        },
                    },
                    totalClassesYear: { $sum: "$totalClasses" },
                    totalStudentsYear: { $sum: "$totalStudents" },
                },
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id",
                    courseName: 1,
                    courseCode: 1,
                    semesters: 1,
                    totalClassesYear: 1,
                    totalStudentsYear: 1,
                },
            },
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
