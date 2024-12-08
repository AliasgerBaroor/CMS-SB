require("../config/database")

const mongoose = require("mongoose");

const CMSSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theme",
    required: true,
  },
  themeColor: { type: String },
  notifications: [{ type: String }],
  language: { type: String }, 
  enableMaintenanceMode: { type: Boolean, default: false }, 
  enable2FA: { type: Boolean, default: false }, 
  customizations: {
    cssOverrides: [{ type: String }],
    jsOverrides: [{ type: String }],
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CMS", CMSSchema);
