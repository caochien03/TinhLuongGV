const Teacher = require("../models/Teacher");

exports.createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate("department", "name shortName")
            .populate("degree", "name shortName");
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate("department", "name shortName")
            .populate("degree", "name shortName");
        if (!teacher) return res.status(404).json({ error: "Not found" });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("department", "name shortName")
            .populate("degree", "name shortName");
        if (!teacher) return res.status(404).json({ error: "Not found" });
        res.json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
