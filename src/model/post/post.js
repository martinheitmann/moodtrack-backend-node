const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now() },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String },
  pinned: { type: Boolean, default: false },
  iconId: { type: String },
});

PostSchema.statics.fetchAllPosts = async function () {
  return await this.find({});
};

PostSchema.statics.findPost = async function (params) {
  return await this.findOne(params || {});
};

PostSchema.statics.findPosts = async function (params) {
  return await this.find(params || {});
};

PostSchema.statics.findPostById = async function (id) {
  return await this.findById(id);
};

PostSchema.statics.createPost = async function (params) {
  return await this.create(params);
};

PostSchema.statics.deletePost = async function (params) {
  await this.deleteOne(params);
  return params._id || null;
};

PostSchema.statics.updatePost = async function (id, params) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true });
};

module.exports = mongoose.model("Post", PostSchema);
