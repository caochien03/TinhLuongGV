const Degree = require("../models/Degree");

exports.createDegree = async (req, res) => {
    try {
        const degree = new Degree(req.body);
        await degree.save();
        res.status(201).json(degree);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getDegrees = async (req, res) => {
    try {
        const degrees = await Degree.find();
        res.json(degrees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDegreeById = async (req, res) => {
    try {
        const degree = await Degree.findById(req.params.id);
        if (!degree) return res.status(404).json({ error: "Not found" });
        res.json(degree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDegree = async (req, res) => {
    try {
        const degree = await Degree.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!degree) return res.status(404).json({ error: "Not found" });
        res.json(degree);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteDegree = async (req, res) => {
    try {
        const degree = await Degree.findByIdAndDelete(req.params.id);
        if (!degree) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
