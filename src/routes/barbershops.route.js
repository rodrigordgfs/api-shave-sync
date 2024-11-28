import barbershopsController from "../controllers/barbershops.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const barbershops = async (fastify) => {
  fastify.get(
    "/barbershops",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershops(request, reply, fastify)
  );
  fastify.get(
    "/barbershops/:id",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.getBarbershopById
  );
  fastify.get(
    "/barbershops/:id/services",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershopServices(request, reply, fastify)
  );
  fastify.get(
    "/barbershops/:idBarbershop/services/:idService",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershopServiceById(request, reply, fastify)
  );
  fastify.post(
    "/barbershops/:id/services",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.postBarbershopService
  );
  fastify.patch(
    "/barbershops/:idBarbershop/services/:idService",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.patchBarbershopService
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
  fastify.get(
    "/barbershops/:id/clients",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershopClients(request, reply, fastify)
  );
  fastify.get(
    "/barbershops/:idBarbershop/clients/:idClient",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershopClientById(request, reply, fastify)
  );
  fastify.post(
    "/barbershops/:id/clients",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.postBarbershopClient
  );
  fastify.patch(
    "/barbershops/:idBarbershop/clients/:idClient",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.patchBarbershopClient
  );
  fastify.get(
    "/barbershops/:id/employees",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershopEmployees(request, reply, fastify)
  );
  fastify.get(
    "/barbershops/:idBarbershop/employees/:idEmployee",
    { preHandler: authMiddleware.validateToken },
    (request, reply) =>
      barbershopsController.getBarbershopEmployeeById(request, reply, fastify)
  );
  fastify.post(
    "/barbershops/:id/employees",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.postBarbershopEmployee
  );
  fastify.patch(
    "/barbershops/:idBarbershop/employees/:idEmployee",
    { preHandler: authMiddleware.validateToken },
    barbershopsController.patchBarbershopEmployee
  );
};

export default barbershops;
