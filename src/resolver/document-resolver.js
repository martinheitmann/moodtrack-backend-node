const mongoose = require("mongoose");
const mongo = mongoose.mongo;
const ObjectId = mongoose.Types.ObjectId;
const Auth = require("../middleware/auth");
const logger = require("../util/logger");

const tag = "document-resolvers: ";

module.exports.documentResolvers = {
  Query: {
    documents(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindDocuments
      );
    },
    document(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindDocument
      );
    },
    documentByName(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindDocumentByName
      );
    },
    documentsByName(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindDocumentsByName
      );
    },
    documentsById(parent, args, context, info) {
      return Auth.requireAdmin(
        parent,
        args,
        context,
        info,
        resolveFindDocumentsById
      );
    },
    documentsByOwner(parent, args, context, info) {
      return Auth.requireOwnership(
        args.ownerId || null,
        parent,
        args,
        context,
        info,
        resolveFindDocumentsByOwner
      );
    },
    documentByOwner(parent, args, context, info) {
      return Auth.requireOwnership(
        args.ownerId || null,
        parent,
        args,
        context,
        info,
        resolveFindDocumentByOwner
      );
    },
  },
  Mutation: {
    uploadDocument(parent, args, context, info) {
      return Auth.requireOwnership(
        args.ownerId || null,
        parent,
        args,
        context,
        info,
        resolveUploadDocument
      );
    },
    deleteDocument(parent, args, context, info) {
      return Auth.requireOwnership(
        args.ownerId || null,
        parent,
        args,
        context,
        info,
        resolveDeleteDocument
      );
    },
  },
};

const resolveUploadDocument = async function (
  parent,
  { file, ownerId },
  context,
  info
) {
  try {
    if (!file || !ownerId) throw "No valid file or userId passed to resolver";
    const { createReadStream, filename, mimetype, encoding } = await file;
    if (mimetype !== "application/pdf") throw Error("invalid file mimetype");
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    });
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { field: "ownerId", value: ownerId },
    });
    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });
    return { filename, mimetype, encoding };
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveFindDocuments = async function (parent, args, context, info) {
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
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
        ownerId: file.metadata.ownerId,
        uploadDate: file.uploadDate,
        md5: file.md5,
        data: buffer.toString("base64"),
      });
    }
    return newFiles;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveDeleteDocument = async function (parent, { _id }, context, info) {
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    });
    bucket.delete(new ObjectId(_id));
    return _id;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveFindDocument = async function (parent, { _id }, context, info) {
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
      ownerId: file.metadata.ownerId,
      uploadDate: file.uploadDate,
      md5: file.md5,
      data: buffer.toString("base64"),
    };
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return error;
  }
};

const resolveFindDocumentByName = async function (
  parent,
  { filename },
  context,
  info
) {
  //console.log("resolveFindIconByName: querying for file with name: " + filename)
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
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
      ownerId: file.metadata.ownerId,
      length: file.length,
      uploadDate: file.uploadDate,
      md5: file.md5,
      data: imageData.toString("base64"),
    };
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return Error;
  }
};

const resolveFindDocumentsByName = async function (
  parent,
  { filenames },
  context,
  info
) {
  if (filenames && filenames.length > 0) {
    const files = [];
    for (const filename of filenames) {
      const file = await resolveFindDocumentByName(
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

const resolveFindDocumentsById = async function (
  parent,
  { fileIds },
  context,
  info
) {
  if (fileIds && fileIds.length > 0) {
    const files = [];
    for (const fileId of fileIds) {
      const file = await resolveFindDocument(
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

const resolveFindDocumentByOwner = async function (
  parent,
  { ownerId, _id },
  context,
  info
) {
  try {
    const doc = await mongoose.connection.db
      .collection("documents.files")
      .findOne({
        _id: new ObjectId(_id),
        "metadata.field": "ownerId",
        "metadata.value": ownerId,
      });
    if (!doc) return null;
    const docFile = await findDocumentById(doc._id);
    if (!(docFile instanceof Error)) {
      docFile.ownerId = ownerId;
      return docFile;
    }
    return null;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return Error("an error occured while fetching document");
  }
};

const resolveFindDocumentsByOwner = async function (
  parent,
  { ownerId },
  context,
  info
) {
  try {
    const docs = await new Promise((resolve, reject) => {
      mongoose.connection.db
        .collection("documents.files")
        .find({
          "metadata.field": "ownerId",
          "metadata.value": ownerId,
        })
        .toArray((err, res) => {
          if (res) resolve(res);
          else if (err) reject(err);
        });
    });
    if (!docs) return [];
    const fetchedFiles = [];
    for (let i = 0; i < docs.length; i++) {
      const id = docs[i]._id;
      const docFile = await findDocumentById(id);
      if (!(docFile instanceof Error)) {
        docFile.ownerId = ownerId;
        fetchedFiles.push(docFile);
      }
    }
    return fetchedFiles;
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return Error;
  }
};

const findDocumentById = async function (id) {
  try {
    const bucket = new mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "documents",
    });

    const fileQuery = await bucket.find({ _id: id }, { limit: 1 }).toArray();
    const file = fileQuery[0];
    if (!file) return null;

    const imageData = await new Promise((resolve, reject) => {
      const bufferChunks = [];
      bucket
        .openDownloadStream(new ObjectId(id))
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
      ownerId: file.metadata.ownerId,
      length: file.length,
      uploadDate: file.uploadDate,
      md5: file.md5,
      data: imageData.toString("base64"),
    };
  } catch (error) {
    logger.log({
      level: "error",
      message: tag + error,
    });
    return Error;
  }
};
