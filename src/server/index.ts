import { ApolloServer, gql } from "apollo-server";
import { Low, JSONFile } from "lowdb";
import { importSchema } from "graphql-import";
import { URL } from "url";
import { Book, Query, Resolvers } from "../types";
type Data = {
  books: Book[];
};

const initDB = async () => {
  const adapter = new JSONFile<Data>(
    new URL("./db.json", import.meta.url).pathname
  );
  const db = new Low<Data>(adapter);
  await db.read();
  return db;
};

const initApolloServer = (db: Low<Data>) => {
  // Resolvers define the technique for fetching the types defined in the
  // schema. This resolver retrieves books from the "books" array above.
  const resolvers: Resolvers = {
    Query: {
      books: async () => {
        db.data = db.data || { books: [] };
        return db.data.books;
      },
    },
  };

  const typeDefs = importSchema("src/server/schema.graphql");
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({ typeDefs, resolvers });
  return server.listen();
};
initDB()
  .then(initApolloServer)
  .then(({ url }: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
