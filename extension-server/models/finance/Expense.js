require("../../config/database")

const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    attachment: { type: Array },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
