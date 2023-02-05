import * as path from 'path';
import * as fs from 'fs';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const typeDefs = fs.readFileSync(
  path.join(__dirname, "./schema/schema.graphql"),
  "utf-8"
);
import { resolvers } from './resolvers/resolvers';


const server = new ApolloServer({
  typeDefs,
  resolvers
});


startStandaloneServer(server, {
  listen: { port: 4000 }
})  
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
  });
