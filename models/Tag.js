const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    parentTagId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
