const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  filename: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "processing" },
  sensitivity: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);
