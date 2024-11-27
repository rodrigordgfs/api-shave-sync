import userController from "../controllers/users.controller.js";

const users = async (fastify) => {
  fastify.post("/users/register", userController.register);
};

export default users;
