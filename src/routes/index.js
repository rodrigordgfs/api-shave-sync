import users from "./users.route.js";

const routes = async (fastify) => {
  fastify.register(users);
};

export default routes;
