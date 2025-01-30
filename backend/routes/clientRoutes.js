const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// Create a new client
router.post("/", async (req, res) => {
    try {
        const newClient = new Client(req.body);
        await newClient.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all clients
router.get("/", async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update client by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(updatedClient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete client by ID (Only if no tasks are assigned)
router.delete("/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).send("Client not found");
        res.status(200).send("Client deleted successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});



module.exports = router;
