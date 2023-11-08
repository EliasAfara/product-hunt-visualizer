import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default server;
