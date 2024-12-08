require("../config/database")
const mongoose = require("mongoose");

const ThemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },   
  previewUrl: { type: Array },   
  assets: {
    cssFiles: [{ type: String }],    
    jsFiles: [{ type: String }],      
    htmlFiles: [{ type: String }],   
  },
  version: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Theme", ThemeSchema);
