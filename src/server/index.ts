import { ApolloServer } from "apollo-server";
import { Low, JSONFile } from "lowdb";
import { importSchema } from "graphql-import";
import { URL } from "url";
import type { Task } from "../types";
import resolvers from "./resolvers.js";

type Data = {
  tasks: Task[];
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
  const server = new ApolloServer({
    typeDefs: importSchema("src/schema.graphql"),
    resolvers: resolvers,
    context: () => db,
  });
  return server.listen();
};

initDB()
  .then(initApolloServer)
  .then(({ url }) => {
    console.info(`🚀  Server ready at ${url}`);
  });
