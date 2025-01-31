const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String } // Optional
});

module.exports = mongoose.model("Group", GroupSchema);
