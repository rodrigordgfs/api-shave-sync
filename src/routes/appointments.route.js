import appointmentsController from "../controllers/appointments.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const appointments = async (fastify) => {
  fastify.post(
    "/appointments",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.postAppointment
  );
  fastify.get(
    "/appointments",
    { preHandler: authMiddleware.validateToken },
    (request, reply) => {
      appointmentsController.getAppointments(request, reply, fastify);
    }
  );
  fastify.get(
    "/appointments/:id",
    { preHandler: authMiddleware.validateToken },
    (request, reply) => {
      appointmentsController.getAppointmentById(request, reply, fastify);
    }
  );
  fastify.patch(
    "/appointments/:id",
    { preHandler: authMiddleware.validateToken },
    appointmentsController.patchAppointment
  );
};

export default appointments;
