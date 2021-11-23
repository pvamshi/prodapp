import { Task, Resolvers } from "../types";
import { nanoid } from "nanoid";

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
  Mutation: {
    tasks: (p, args, db) => {
      db.data = db.data || { tasks: [] };
      const t: Task = { title: args.title, id: nanoid(), progress: 0 };
      db.data.tasks.push(t);
      return t;
    },
  },
};
export default resolvers;
