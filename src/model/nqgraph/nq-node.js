const mongoose = require("mongoose");
const NQData = require("./nq-data");

const NQNodeSchema = new mongoose.Schema({
  nqId: mongoose.Types.ObjectId,
  nodeLabel: { type: String },
  isSourceNode: { type: Boolean },
  isArchived: { type: Boolean, default: false },
  position: {
    xPos: { type: Number },
    yPos: { type: Number },
  },
  data: NQData,
});

NQNodeSchema.statics.getAllNodes = async function () {
  return await this.find({});
};

NQNodeSchema.statics.getNodes = async function (params) {
  return await this.find(params || {});
};

NQNodeSchema.statics.findNode = async function (params) {
  return await this.findOne(params);
};

NQNodeSchema.statics.findNodeById = async function (id) {
  return await this.findById(id);
};

NQNodeSchema.statics.createNode = async function (params) {
  return await this.create(params);
};

NQNodeSchema.statics.updateNode = async function (id, params) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true });
};

NQNodeSchema.statics.deleteNode = async function (params) {
  await this.deleteOne(params);
  return params._id || null;
};

module.exports = mongoose.model("NQNode", NQNodeSchema);
