import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import appointmentService from "../services/appointments.service.js";
import constants from "../utils/constants.js";

const handleErrorResponse = (error, reply) => {
  if (error instanceof z.ZodError) {
    return reply.code(StatusCodes.BAD_REQUEST).send({
      error: error.errors.map(({ message, path }) => ({
        message,
        field: path[0],
      })),
    });
  }

  const errorMessages = {
    "Barbearia já existe": StatusCodes.CONFLICT,
    "Barbearia não encontrada": StatusCodes.NOT_FOUND,
    "Serviço não encontrado": StatusCodes.NOT_FOUND,
    "Cliente não encontrado": StatusCodes.NOT_FOUND,
    "Usuário não encontrado": StatusCodes.NOT_FOUND,
    "Funcionário não encontrado": StatusCodes.NOT_FOUND,
    "Barbearia não abre neste dia": StatusCodes.BAD_REQUEST,
    "Horário fora do expediente": StatusCodes.BAD_REQUEST,
    "Horário não permitido para agendamentos": StatusCodes.BAD_REQUEST,
    "Funcionário indisponível neste horário": StatusCodes.BAD_REQUEST,
    "Cliente já possui um agendamento neste horário": StatusCodes.BAD_REQUEST,
    "Formato de data inválido para dateTime": StatusCodes.BAD_REQUEST,
    "Não é possível agendar para um horário no passado":
      StatusCodes.BAD_REQUEST,
  };

  const statusCode =
    errorMessages[error.message] || StatusCodes.INTERNAL_SERVER_ERROR;
  reply.code(statusCode).send({
    error: error.message || "Ocorreu um erro interno",
  });
};

const validateCache = async (fastify, cacheKey) => {
  const cache = await fastify.cache.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
};

const postAppointment = async (request, reply) => {
  try {
    const schemaBody = z.object({
      barbershopId: z.string().uuid({
        message: "O id da barbearia deve ser um UUID",
      }),
      serviceId: z.string().uuid({
        message: "O id do serviço deve ser um UUID",
      }),
      employeeId: z.string().uuid({
        message: "O id do funcionário deve ser um UUID",
      }),
      clientId: z.string().uuid({
        message: "O id do cliente deve ser um UUID",
      }),
      dateTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "A data e hora devem ser válidas",
      }),
    });

    const { barbershopId, serviceId, employeeId, clientId, dateTime } =
      schemaBody.parse(request.body);

    const appointment = await appointmentService.postAppointment(
      barbershopId,
      serviceId,
      employeeId,
      clientId,
      dateTime
    );

    reply.code(StatusCodes.CREATED).send(appointment);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getAppointments = async (request, reply, fastify) => {
  try {
    const schemaQuery = z.object({
      barbershopId: z.string().uuid({
        message: "O id da barbearia deve ser um UUID",
      }),
      date: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
          message: "A data deve ser válida",
        })
        .optional(),
    });

    const { barbershopId, date } = schemaQuery.parse(request.query);

    const cacheKey = `barbershop:${barbershopId}:appointments`;
    const cache = await validateCache(fastify, cacheKey);
    if (cache) {
      return reply.send(cache);
    }

    const appointments = await appointmentService.getAppointments(
      barbershopId,
      date
    );

    await fastify.cache.set(cacheKey, JSON.stringify(appointments), 60);

    reply.send(appointments);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getAppointmentById = async (request, reply, fastify) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid({
        message: "O id do agendamento deve ser um UUID",
      }),
    });

    const { id } = schemaParams.parse(request.params);

    const cacheKey = `appointment:${id}`;
    const cache = await validateCache(fastify, cacheKey);
    if (cache) {
      return reply.send(cache);
    }

    const appointment = await appointmentService.getAppointmentById(id);

    await fastify.cache.set(cacheKey, JSON.stringify(appointment), 60);

    reply.send(appointment);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  postAppointment,
  getAppointments,
  getAppointmentById,
};
