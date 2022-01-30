const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  event: { type: String },
  name: { type: String },
  path: { type: String },
  certificateID: { type: String},
  certificateNumber: { type: Number },
  createdDate: { type: Date, default: Date.now }
});

certificateSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);