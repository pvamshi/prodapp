import { ApolloServer, gql } from "apollo-server";
import { Low, JSONFile } from "lowdb";
import { importSchema } from "graphql-import";
import { URL } from "url";
import { Book, Query, Resolvers } from "../types";
type Data = {
  books: Book[];
};

const adapter = new JSONFile<Data>(
  new URL("./db.json", import.meta.url).pathname
);
const db = new Low<Data>(adapter);

/*
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
 `;

 */
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers: Resolvers = {
  Query: {
    books: async () => {
      await db.read();
      db.data = db.data || { books: [] };
      return db.data.books;
    },
  },
};

const typeDefs = importSchema("src/server/schema.graphql");
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`);
});
