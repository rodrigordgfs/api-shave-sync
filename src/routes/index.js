import barbershops from "./barbershops.route.js";
import users from "./users.route.js";

const routes = async (fastify) => {
  fastify.register(users);
  fastify.register(barbershops);
};

export default routes;
