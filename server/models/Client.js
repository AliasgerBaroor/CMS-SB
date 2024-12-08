require("../config/database")

const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String },
    cms: { type: mongoose.Schema.Types.ObjectId, ref: "CMS", required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Client", ClientSchema);
  