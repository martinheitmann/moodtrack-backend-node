const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  fcmRegistrationToken: { type: String },
  notificationsEnabled: { type: Boolean },
  profileImage: { type: String },
  creationDate: { type: Date },
  email: { type: String },
});

UserSchema.statics.fetchAllUsers = async function () {
  return await this.find({});
};

UserSchema.statics.findUsers = async function (params) {
  return await this.find(params || {});
};

UserSchema.statics.findUserByEmail = async function (email) {
  return await this.findOne({ email: email });
};

UserSchema.statics.findUserById = async function (id) {
  return await this.findById(id);
};

UserSchema.statics.createUser = async function (params) {
  return await this.create(params);
};

UserSchema.statics.deleteUser = async function (params) {
  await this.deleteOne(params);
  return params._id || null;
};

UserSchema.statics.updateUser = async function (id, params) {
  return await this.findOneAndUpdate({ _id: id }, params, { new: true });
};

module.exports = mongoose.model("User", UserSchema);
