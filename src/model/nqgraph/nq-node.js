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
  try {
    return await this.find({});
  } catch (err) {
    return err;
  }
};

NQNodeSchema.statics.getNodes = async function (params) {
  try {
    return await this.find(params || {});
  } catch (err) {
    return err;
  }
};

NQNodeSchema.statics.findNode = async function (params) {
  try {
    return await this.findOne(params);
  } catch (err) {
    return err;
  }
};

NQNodeSchema.statics.findNodeById = async function (id) {
  try {
    return await this.findById(id);
  } catch (err) {
    return err;
  }
};

NQNodeSchema.statics.createNode = async function (params) {
  try {
    return await this.create(params);
  } catch (err) {
    return err;
  }
};

NQNodeSchema.statics.updateNode = async function (id, params) {
  try {
    return await this.findOneAndUpdate({ _id: id }, params, { new: true });
  } catch (err) {
    return err;
  }
};

NQNodeSchema.statics.deleteNode = async function (params) {
  try {
    await this.deleteOne(params);
    return params._id || null;
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model("NQNode", NQNodeSchema);
