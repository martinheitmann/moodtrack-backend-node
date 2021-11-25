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
  try {
    return await this.find({});
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.getEdges = async function (params) {
  try {
    return await this.find(params || {});
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.getEdge = async function (params) {
  try {
    return await this.findOne(params);
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.getEdgeById = async function (id) {
  try {
    return await this.findById(id);
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.createEdge = async function (params) {
  try {
    return await this.create(params);
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.updateEdge = async function (id, params) {
  try {
    return await this.findOneAndUpdate({ _id: id }, params, { new: true });
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.deleteEdge = async function (params) {
  try {
    await this.deleteOne(params);
    return params._id || null;
  } catch (err) {
    return err;
  }
};

NQEdgeSchema.statics.deleteEdges = async function (params) {
  try {
    await this.deleteMany(params);
    return params._id || null;
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model("NQEdge", NQEdgeSchema);
