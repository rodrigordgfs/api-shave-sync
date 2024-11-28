import fastifyPlugin from "fastify-plugin";
import { createClient } from "redis";
import environment from "../config/envs.js";

const redisCache = async (fastify) => {
  try {
    fastify.log.info("Attempting to connect to Redis...");

    const redisClient = createClient({
      url: environment.redis_url,
    });

    redisClient.on("error", (err) => {
      fastify.log.error(`Redis error: ${err.message}`);
      throw err;
    });

    await redisClient.connect();

    fastify.decorate("cache", redisClient);
    fastify.log.info("Redis connected successfully!");
  } catch (error) {
    fastify.log.error(`Failed to initialize Redis: ${error.message}`);
    throw error;
  }
};

export default fastifyPlugin(redisCache);
