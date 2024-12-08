require("../config/database")
const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  resource: { type: String, required: true }, // e.g., "CMS", "Themes"
  read: { type: Boolean, default: false },
  write: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
});

const RolesSchema = new mongoose.Schema({
  role: { type: String, required: true }, // e.g., "Admin", "Manager"
  permissions: [PermissionSchema], // Array of permissions
});

module.exports = mongoose.model("roles", RolesSchema);
