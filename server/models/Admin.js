require("../config/database")

const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "rootAdmin"],
    default: "admin",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  lastLogin: { type: Date },
  lastPasswordReset: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", AdminSchema);
