require("../../config/database")

const mongoose = require("mongoose");

const TexationSchema = new mongoose.Schema({
    region: { type: String, required: true, default: "India" },
    tax_name: { type: String, required: true },
    rate: { type: Number, required: true },
    product_category: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Texation", TexationSchema);
