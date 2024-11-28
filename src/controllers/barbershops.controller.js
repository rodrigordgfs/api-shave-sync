import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import barbershopsService from "../services/barbershops.service.js";
import servicesService from "../services/services.service.js";
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

const getBarbershops = async (request, reply, fastify) => {
  try {
    const cacheKey = "barbershops";
    const cache = await validateCache(fastify, cacheKey);
    if (cache) {
      return reply.code(StatusCodes.OK).send(cache);
    }

    const barbershops = await barbershopsService.getBarbershops();
    await fastify.cache.set(cacheKey, JSON.stringify(barbershops), { EX: 60 });

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

    const cacheKey = `barbershops:${id}`;
    const cache = await validateCache(fastify, cacheKey);
    if (cache) {
      return reply.code(StatusCodes.OK).send(cache);
    }

    const barbershop = await barbershopsService.getBarbershopById(id);
    await fastify.cache.set(cacheKey, JSON.stringify(barbershop), { EX: 60 });

    reply.code(StatusCodes.OK).send(barbershop);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getBarbershopServices = async (request, reply, fastify) => {
  const schemaParams = z.object({
    id: z.string().uuid({
      message: "O id deve ser um UUID",
    }),
  });

  const { id } = schemaParams.parse(request.params);

  const cacheKey = `barbershops:${id}:services`;
  const cache = await validateCache(fastify, cacheKey);
  if (cache) {
    return reply.code(StatusCodes.OK).send(cache);
  }

  const services = await servicesService.getServicesByBarbershopId(id);
  await fastify.cache.set(cacheKey, JSON.stringify(services), { EX: 60 });

  reply.code(StatusCodes.OK).send(services);
};

const getBarbershopServiceById = async (request, reply, fastify) => {
  const schemaParams = z.object({
    idBarbershop: z.string().uuid({
      message: "O id deve ser um UUID",
    }),
    idService: z.string().uuid({
      message: "O id deve ser um UUID",
    }),
  });

  const { idBarbershop, idService } = schemaParams.parse(request.params);

  const cacheKey = `barbershops:${idBarbershop}:services:${idService}`;
  const cache = await validateCache(fastify, cacheKey);
  if (cache) {
    return reply.code(StatusCodes.OK).send(cache);
  }

  const service = await servicesService.getServiceByBarbershopById(
    idBarbershop,
    idService
  );
  await fastify.cache.set(cacheKey, JSON.stringify(service), { EX: 60 });

  reply.code(StatusCodes.OK).send(service);
};

const postBarbershopService = async (request, reply) => {
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
      description: z
        .string()
        .min(3, {
          message: "A descrição deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "A descrição deve ter no máximo 255 caracteres",
        }),
      image: z.string().url({
        message: "A imagem é inválida",
      }),
      price: z.number().min(0, {
        message: "O preço deve ser maior que 0",
      }),
      duration: z.number().min(1, {
        message: "A duração deve ser maior que 0",
      }),
    });

    const { id } = schemaParams.parse(request.params);
    const { name, description, price, duration, image } = schemaBody.parse(
      request.body
    );

    const service = await servicesService.postBarberhopService(
      id,
      name,
      description,
      price,
      duration,
      image
    );

    reply.code(StatusCodes.CREATED).send(service);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const patchBarbershopService = async (request, reply) => {
  try {
    const schemaParams = z.object({
      idBarbershop: z.string().uuid({
        message: "O id da barbearia deve ser um UUID",
      }),
      idService: z.string().uuid({
        message: "O id do serviço deve ser um UUID",
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
      description: z
        .string()
        .min(3, {
          message: "A descrição deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "A descrição deve ter no máximo 255 caracteres",
        }),
      image: z.string().url({
        message: "A imagem é inválida",
      }),
      price: z.number().min(0, {
        message: "O preço deve ser maior que 0",
      }),
      duration: z.number().min(1, {
        message: "A duração deve ser maior que 0",
      }),
    });

    const { idBarbershop, idService } = schemaParams.parse(request.params);
    const { name, description, price, duration, image } = schemaBody.parse(
      request.body
    );

    const service = await servicesService.patchBarberhopService(
      idBarbershop,
      idService,
      name,
      description,
      price,
      duration,
      image
    );

    reply.code(StatusCodes.OK).send(service);
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

const getBarbershopClients = async (request, reply, fastify) => {
  try {
    const schemaParams = z.object({
      id: z.string().uuid({
        message: "O id deve ser um UUID",
      }),
    });

    const { id } = schemaParams.parse(request.params);

    const cacheKey = `barbershops:${id}:clients`;
    const cache = await validateCache(fastify, cacheKey);
    if (cache) {
      return reply.code(StatusCodes.OK).send(cache);
    }

    const clients = await barbershopsService.getBarbershopClients(id);
    await fastify.cache.set(cacheKey, JSON.stringify(clients), { EX: 60 });

    reply.code(StatusCodes.OK).send(clients);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const getBarbershopClientById = async (request, reply, fastify) => {
  try {
    const schemaParams = z.object({
      idBarbershop: z.string().uuid({
        message: "O id da barbearia deve ser um UUID",
      }),
      idClient: z.string().uuid({
        message: "O id do cliente deve ser um UUID",
      }),
    });

    const { idBarbershop, idClient } = schemaParams.parse(request.params);

    const cacheKey = `barbershops:${idBarbershop}:clients:${idClient}`;
    const cache = await validateCache(fastify, cacheKey);
    if (cache) {
      return reply.code(StatusCodes.OK).send(cache);
    }

    const client = await barbershopsService.getBarbershopClientById(
      idBarbershop,
      idClient
    );
    await fastify.cache.set(cacheKey, JSON.stringify(client), { EX: 60 });

    reply.code(StatusCodes.OK).send(client);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const postBarbershopClient = async (request, reply) => {
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
      phone: z
        .string()
        .min(8, {
          message: "O telefone deve ter no mínimo 8 caracteres",
        })
        .max(20, {
          message: "O telefone deve ter no máximo 20 caracteres",
        }),
      email: z.string().email({
        message: "O email é inválido",
      }),
      address: z
        .string()
        .min(3, {
          message: "O endereço deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "O endereço deve ter no máximo 255 caracteres",
        }),
      profilePicture: z.string().url({
        message: "A foto de perfil é inválida",
      }),
    });

    const { id } = schemaParams.parse(request.params);
    const { name, phone, email, address, profilePicture } = schemaBody.parse(
      request.body
    );

    const client = await barbershopsService.postBarbershopClient(
      id,
      name,
      phone,
      email,
      address,
      profilePicture
    );

    reply.code(StatusCodes.CREATED).send(client);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const patchBarbershopClient = async (request, reply) => {
  try {
    const schemaParams = z.object({
      idBarbershop: z.string().uuid({
        message: "O id da barbearia deve ser um UUID",
      }),
      idClient: z.string().uuid({
        message: "O id do cliente deve ser um UUID",
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
      phone: z
        .string()
        .min(8, {
          message: "O telefone deve ter no mínimo 8 caracteres",
        })
        .max(20, {
          message: "O telefone deve ter no máximo 20 caracteres",
        }),
      email: z.string().email({
        message: "O email é inválido",
      }),
      address: z
        .string()
        .min(3, {
          message: "O endereço deve ter no mínimo 3 caracteres",
        })
        .max(255, {
          message: "O endereço deve ter no máximo 255 caracteres",
        }),
      profilePicture: z.string().url({
        message: "A foto de perfil é inválida",
      }),
    });

    const { idBarbershop, idClient } = schemaParams.parse(request.params);
    const { name, phone, email, address, profilePicture } = schemaBody.parse(
      request.body
    );

    const client = await barbershopsService.patchBarbershopClient(
      idBarbershop,
      idClient,
      name,
      phone,
      email,
      address,
      profilePicture
    );

    reply.code(StatusCodes.OK).send(client);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  getBarbershops,
  getBarbershopById,
  getBarbershopServices,
  postBarbershopService,
  patchBarbershopService,
  postBarbershop,
  patchBarbershop,
  patchBarbershopPreferences,
  getBarbershopServiceById,
  getBarbershopClients,
  getBarbershopClientById,
  postBarbershopClient,
  patchBarbershopClient,
};
