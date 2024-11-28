import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import barbershopsService from "../services/barbershops.service.js";
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
  };

  const statusCode =
    errorMessages[error.message] || StatusCodes.INTERNAL_SERVER_ERROR;
  reply.code(statusCode).send({
    error: error.message || "Ocorreu um erro interno",
  });
};

const getBarbershops = async (request, reply) => {
  try {
    const barbershops = await barbershopsService.getBarbershops();
    reply.code(StatusCodes.OK).send(barbershops);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getBarbershopById = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid({
        message: "O id deve ser um UUID",
      }),
    });

    const { id } = schemaParams.parse(request.params);

    const barbershop = await barbershopsService.getBarbershopById(id);

    reply.code(StatusCodes.OK).send(barbershop);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const postBarbershop = async (request, reply) => {
  try {
    const schemaBody = z.object({
      name: z
        .string()
        .min(3, {
          message: "O nome deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "O nome deve ter no máximo 255 caracteres",
        }),
      address: z
        .string()
        .min(3, {
          message: "O endereço deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "O endereço deve ter no máximo 255 caracteres",
        }),
      phone: z
        .string()
        .min(8, {
          message: "O telefone deve ter no mínimo 8 caracteres",
        })
        .max(20, {
          message: "O telefone deve ter no máximo 20 caracteres",
        }),
      profilePicture: z.string().url({
        message: "A foto de perfil é inválida",
      }),
      banner: z.string().url({
        message: "O banner é inválido",
      }),
      userId: z.string().uuid({
        message: "O id do usuário deve ser um UUID",
      }),
    });

    const { name, address, phone, profilePicture, banner, userId } =
      schemaBody.parse(request.body);

    const barbershop = await barbershopsService.postBarbershop(
      name,
      address,
      phone,
      profilePicture,
      banner,
      userId
    );

    reply.code(StatusCodes.CREATED).send(barbershop);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const patchBarbershop = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid({
        message: "O id deve ser um UUID",
      }),
    });

    const schemaBody = z.object({
      name: z
        .string()
        .min(3, {
          message: "O nome deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "O nome deve ter no máximo 255 caracteres",
        }),
      address: z
        .string()
        .min(3, {
          message: "O endereço deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "O endereço deve ter no máximo 255 caracteres",
        }),
      phone: z
        .string()
        .min(8, {
          message: "O telefone deve ter no mínimo 8 caracteres",
        })
        .max(20, {
          message: "O telefone deve ter no máximo 20 caracteres",
        }),
      profilePicture: z.string().url({
        message: "A foto de perfil é inválida",
      }),
      banner: z.string().url({
        message: "O banner é inválido",
      }),
    });

    const { id } = schemaParams.parse(request.params);
    const { name, address, phone, profilePicture, banner } = schemaBody.parse(
      request.body
    );

    const barbershop = await barbershopsService.patchBarbershop(
      id,
      name,
      address,
      phone,
      profilePicture,
      banner
    );

    reply.code(StatusCodes.OK).send(barbershop);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const patchBarbershopPreferences = async (request, reply) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid({
        message: "O id deve ser um UUID",
      }),
    });

    const schemaBody = z.object({
      intervalOperation: z.number().int().min(1).max(60),
      closeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "O horário de fechamento é inválido",
      }),
      openTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "O horário de abertura é inválido",
      }),
      weekDaysOperation: z.array(
        z.enum([
          constants.weekDays.friday,
          constants.weekDays.monday,
          constants.weekDays.saturday,
          constants.weekDays.tuesday,
          constants.weekDays.thursday,
          constants.weekDays.wednesday,
          constants.weekDays.sunday,
        ])
      ),
    });

    const { id } = schemaParams.parse(request.params);
    const { intervalOperation, closeTime, openTime, weekDaysOperation } =
      schemaBody.parse(request.body);

    const barbershop = await barbershopsService.patchBarbershopPreferences(
      id,
      intervalOperation,
      closeTime,
      openTime,
      weekDaysOperation
    );

    reply.code(StatusCodes.OK).send(barbershop);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  getBarbershops,
  getBarbershopById,
  postBarbershop,
  patchBarbershop,
  patchBarbershopPreferences,
};
