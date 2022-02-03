const mongoose = require("mongoose");
const NQCondition = require("./nq-condition");

const NQEdgeSchema = new mongoose.Schema({
  nqId: mongoose.Types.ObjectId,
  source: mongoose.Types.ObjectId,
  target: mongoose.Types.ObjectId,
  isArchived: { type: Boolean, default: false },
  edgeLabel: { type: String },
  condition: NQCondition,
});

NQEdgeSchema.statics.getAllEdges = async function () {
  return await this.find({});
};

NQEdgeSchema.statics.getEdges = async function (params) {
  return await this.find(params || {});
};

NQEdgeSchema.statics.getEdge = async function (params) {
  return await this.findOne(params);
};

NQEdgeSchema.statics.getEdgeById = async function (id) {
  return await this.findById(id);
};

NQEdgeSchema.statics.createEdge = async function (params) {
  return await this.create(params);
};

NQEdgeSchema.statics.updateEdge = async function (id, params) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true });
};

NQEdgeSchema.statics.deleteEdge = async function (params) {
  await this.deleteOne(params);
  return params._id || null;
};

NQEdgeSchema.statics.deleteEdges = async function (params) {
  await this.deleteMany(params);
  return params._id || null;
};

module.exports = mongoose.model("NQEdge", NQEdgeSchema);
