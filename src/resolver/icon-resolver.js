const mongoose = require("mongoose");
const mongo = mongoose.mongo;
const ObjectId = mongoose.Types.ObjectId;
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

module.exports.iconResolvers = {
  Query: {
    icons(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindIcons
      );
    },
    icon(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindIcon
      );
    },
    iconByName(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindIconByName
      );
    },
    iconsByName(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindIconsByName
      );
    },
    iconsById(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindIconsById
      );
    },
  },
  Mutation: {
    uploadIcon(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveUploadIcon);
    },
    deleteIcon(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveDeleteIcon);
    },
  },
};

const resolveUploadIcon = async function (parent, { file }, context, info) {
  try {
    if (!file) throw "No valid file passed to resolver";
    const { createReadStream, filename, mimetype, encoding } = await file;
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "icons",
    });
    const uploadStream = bucket.openUploadStream(filename);
    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });
    return { filename, mimetype, encoding };
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};

const resolveFindIcons = async function (parent, args, context, info) {
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "icons",
    });
    const files = await bucket.find(args).toArray();

    const newFiles = [];
    for (const file of files) {
      const buffer = await new Promise((resolve, reject) => {
        const bufferChunks = [];
        bucket
          .openDownloadStreamByName(file.filename)
          .on("data", function (data) {
            bufferChunks.push(data);
          })
          .on("error", function (error) {
            reject(error);
          })
          .on("finish", function () {})
          .on("close", function () {
            const buffer = Buffer.concat(bufferChunks);
            resolve(buffer);
          });
      });
      newFiles.push({
        _id: file._id,
        filename: file.filename,
        length: file.length,
        uploadDate: file.uploadDate,
        md5: file.md5,
        data: buffer.toString("base64"),
      });
    }
    return newFiles;
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};

const resolveDeleteIcon = async function (
  parent,
  { _id, filename },
  context,
  info
) {
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "icons",
    });
    bucket.delete(new ObjectId(_id));
    return _id;
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};

const resolveFindIcon = async function (parent, { _id }, context, info) {
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "icons",
    });
    if (!ObjectId.isValid(_id)) return null;
    const fileQuery = await bucket
      .find({ _id: new ObjectId(_id) }, { limit: 1 })
      .toArray();
    const file = fileQuery[0];
    if (!file) return null;

    const buffer = await new Promise((resolve, reject) => {
      const bufferChunks = [];
      bucket
        .openDownloadStream(new ObjectId(_id))
        .on("data", function (data) {
          bufferChunks.push(data);
        })
        .on("error", function (error) {
          reject(error);
        })
        .on("finish", function () {})
        .on("close", function () {
          const buffer = Buffer.concat(bufferChunks);
          resolve(buffer);
        });
    });
    return {
      _id: file._id,
      filename: file.filename,
      length: file.length,
      uploadDate: file.uploadDate,
      md5: file.md5,
      data: buffer.toString("base64"),
    };
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};

const resolveFindIconByName = async function (
  parent,
  { filename },
  context,
  info
) {
  //console.log("resolveFindIconByName: querying for file with name: " + filename)
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "icons",
    });

    const fileQuery = await bucket
      .find({ filename: filename }, { limit: 1 })
      .toArray();
    const file = fileQuery[0];
    if (!file) return null;

    const imageData = await new Promise((resolve, reject) => {
      const bufferChunks = [];
      bucket
        .openDownloadStreamByName(file.filename)
        .on("data", function (data) {
          bufferChunks.push(data);
        })
        .on("error", function (error) {
          reject(error);
        })
        .on("finish", function () {})
        .on("close", function () {
          const buffer = Buffer.concat(bufferChunks);
          resolve(buffer);
        });
    });
    return {
      _id: file._id,
      filename: file.filename,
      length: file.length,
      uploadDate: file.uploadDate,
      md5: file.md5,
      data: imageData.toString("base64"),
    };
  } catch (err) {
    logger.log({ level: "error", message: err });
    return err;
  }
};

const resolveFindIconsByName = async function (
  parent,
  { filenames },
  context,
  info
) {
  if (filenames && filenames.length > 0) {
    const files = [];
    for (const filename of filenames) {
      const file = await resolveFindIconByName(
        parent,
        { filename: filename },
        context,
        info
      );
      files.push(file);
    }
    return files;
  } else return [];
};

const resolveFindIconsById = async function (
  parent,
  { fileIds },
  context,
  info
) {
  if (fileIds && fileIds.length > 0) {
    const files = [];
    for (const fileId of fileIds) {
      const file = await resolveFindIcon(
        parent,
        { _id: fileId },
        context,
        info
      );
      files.push(file);
    }
    return files;
  } else return [];
};
