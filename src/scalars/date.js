const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    try {
      return new Date(value); // value from the client
    } catch (error) {
      console.log(error);
    }
  },
  serialize(value) {
    try {
      return value.toISOString();
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  parseLiteral(ast) {
    try {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value); // ast value is always in string format
      }
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  },
});

module.exports = dateScalar;
