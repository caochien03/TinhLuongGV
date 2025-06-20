const Semester = require("../models/Semester");

exports.createSemester = async (req, res) => {
    try {
        const semester = new Semester(req.body);
        await semester.save();
        res.status(201).json(semester);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSemesters = async (req, res) => {
    try {
        const semesters = await Semester.find();
        res.json(semesters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSemesterById = async (req, res) => {
    try {
        const semester = await Semester.findById(req.params.id);
        if (!semester) return res.status(404).json({ error: "Not found" });
        res.json(semester);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSemester = async (req, res) => {
    try {
        const semester = await Semester.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!semester) return res.status(404).json({ error: "Not found" });
        res.json(semester);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteSemester = async (req, res) => {
    try {
        const semester = await Semester.findByIdAndDelete(req.params.id);
        if (!semester) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
