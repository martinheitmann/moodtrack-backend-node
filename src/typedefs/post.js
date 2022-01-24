const { gql } = require("apollo-server-express");

module.exports.PostType = gql`
  type PostType {
    _id: ID
    created: Date
    title: String
    body: String
    type: String
    iconId: String
    pinned: Boolean
  }
`;

module.exports.PostInput = gql`
  input PostInput {
    title: String!
    body: String!
    type: String
    iconId: String
    pinned: Boolean
  }
`;
