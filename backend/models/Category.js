const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { 
        type: String, 
        enum: ["Client", "Plan", "Group", "Team", "Service", "Password"],
        required: true 
    }
});

module.exports = mongoose.model("Category", categorySchema);
