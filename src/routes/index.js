import barbershops from "./barbershops.route.js";
import users from "./users.route.js";
import appointments from "./appointments.route.js";

const routes = async (fastify) => {
  fastify.register(users);
  fastify.register(barbershops);
  fastify.register(appointments);
};

export default routes;
