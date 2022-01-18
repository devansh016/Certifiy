const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateSchema = new Schema({
  name: { type: String, unique: true, required: true },
  path: { type: String},
  filename: { type: String},
  settings: {
    font: { type: String},
    fontSize: { type: String},
    fontColor: { type: Array},
    positionX: { type: Number},
    positionY: { type: Number}
  },
  readyToUse: {type: Boolean, default: false},
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