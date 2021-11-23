import { Low } from "lowdb";
import { Task, Resolvers } from "../types";

// TOOD: Autogenerate this type
type Data = {
  tasks: Task[];
};
const resolvers: Resolvers = {
  Query: {
    tasks: async (p, a, db) => {
      db.data = db.data || { tasks: [] };
      return db.data.tasks;
    },
  },
};
export default resolvers;
