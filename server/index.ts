import { startStandaloneServer } from "@apollo/server/standalone";
import "dotenv/config";
import server from "./src/server.js";

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
