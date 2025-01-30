const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    PAN: { type: String },
    category: { type: String, required: true },
    group: { type: String, required: true },
    mobile: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Client", clientSchema);
