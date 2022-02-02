const Post = require("../model/post/post");
const Auth = require("../middleware/auth");

module.exports.postResolvers = {
  Query: {
    async post(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindPost
      );
    },
    async posts(parent, args, context, info) {
      return Auth.requireAuthentication(
        parent,
        args,
        context,
        info,
        resolveFindPosts
      );
    },
  },
  Mutation: {
    async createPost(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveCreatePost);
    },
    async modifyPost(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveModifyPost);
    },
    async deletePost(parent, args, context, info) {
      return Auth.requireAdmin(parent, args, context, info, resolveDeletePost);
    },
  },
};

const resolveCreatePost = async function (parent, args, context, info) {
  try {
    return await Post.createPost(args.post);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveFindPosts = async function (parent, args, context, info) {
  try {
    return await Post.findPosts(args);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveFindPost = async function (parent, args, context, info) {
  try {
    return await Post.findPost(args);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveDeletePost = async function (parent, args, context, info) {
  try {
    return await Post.deletePost(args);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const resolveModifyPost = async function (parent, args, context, info) {
  try {
    return await Post.updatePost(args._id, args.post);
  } catch (error) {
    console.log(error);
    return error;
  }
};
