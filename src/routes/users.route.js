import userController from "../controllers/users.controller.js";

const users = async (fastify) => {
  fastify.post("/users/register", userController.register);
  fastify.post("/users/login", userController.login);
};

export default users;
