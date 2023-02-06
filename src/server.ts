import * as path from 'path';
import * as fs from 'fs';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
const typeDefs = fs.readFileSync(
  path.join(__dirname, "./schema/schema.graphql"),
  "utf-8"
);
import { resolvers } from './resolvers/resolvers';
const jwt = require('jsonwebtoken');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    // get from authHeader req header (if no authHeader, return empty context)
    const authHeader: string = req.headers.authorization!;
    if (!authHeader) return {};
    
    // extract jwt from authHeader and verify it
    try {
      const token: string = authHeader.replace('Bearer ', '');
      let me = await jwt.verify(token, process.env.JWT_secret);
      return me;
    } catch (e) {
      throw new GraphQLError('JWT verification failed', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });
    }
  }
})  
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  });
