const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: { type: String, unique: true, required: true },
  designPath: { type: String },
  filename: { type: String },
  settings: {
    font: { type: String },
    fontSize: { type: String },
    fontColor: { type: Array },
    positionX: { type: Number },
    positionY: { type: Number }
  },
  totalCertificates: { type: Number, default: 0},
  readyToUse: {type: Boolean, default: false},
  createdDate: { type: Date, default: Date.now }
});

eventSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Event", eventSchema);