import fastify from "fastify";
import cors from "@fastify/cors";
import environment from "./config/envs.js";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app
  .listen({ port: environment.port, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server is running on port ${environment.port}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
