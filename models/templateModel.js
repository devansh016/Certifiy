const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateSchema = new Schema({
  name: { type: String, unique: true, required: true },
  path: { type: String, unique: true, required: true },
  filename: { type: String, unique: true, required: true },
  size: { type: Number, default: 0},
  createdDate: { type: Date, default: Date.now }
});

templateSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Template", templateSchema);