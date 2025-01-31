const express = require("express");
const router = express.Router();
const Group = require("../models/Group"); // Ensure you have a Group model

// GET all groups
router.get("/", async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new group
router.post("/", async (req, res) => {
    const { name, category } = req.body;
    const newGroup = new Group({ name, category });

    try {
        const savedGroup = await newGroup.save();
        res.json(savedGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
