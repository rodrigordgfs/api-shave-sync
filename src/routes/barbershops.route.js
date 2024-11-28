import barbershopsController from "../controllers/barbershops.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const barbershops = async (fastify) => {
  fastify.get(
    "/barbershops",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.getBarbershops
  );
  fastify.get(
    "/barbershops/:id",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.getBarbershopById
  );
  fastify.post(
    "/barbershops",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.postBarbershop
  );
  fastify.patch(
    "/barbershops/:id",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.patchBarbershop
  );
  fastify.patch(
    "/barbershops/:id/preferences",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.patchBarbershopPreferences
  );
};

export default barbershops;
