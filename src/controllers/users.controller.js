import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import userService from '../services/users.service.js';

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
    "Usuário já existe": StatusCodes.CONFLICT,
    "Email ou senha incorreto": StatusCodes.UNAUTHORIZED,
    "Usuário não encontrado": StatusCodes.NOT_FOUND,
  };

  const statusCode =
    errorMessages[error.message] || StatusCodes.INTERNAL_SERVER_ERROR;
  reply.code(statusCode).send({
    error: error.message || "Ocorreu um erro interno",
  });
};

const register = async (request, reply) => {
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
      email: z.string().email({
        message: "O e-mail é inválido",
      }),
      password: z
        .string()
        .min(6, {
          message: "A senha deve ter no mínimo 6 caracteres",
        })
        .max(255, {
          message: "A senha deve ter no máximo 255 caracteres",
        }),
    });

    const { name, email, password } = schemaBody.parse(request.body);

    const user = await userService.register(name, email, password);

    reply.status(StatusCodes.CREATED).send(user);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const login = async (request, reply) => {
  try {
    const schemaBody = z.object({
      email: z.string().email({
        message: "O e-mail é inválido",
      }),
      password: z.string().min(6, {
        message: "A senha deve ter no mínimo 6 caracteres",
      }).max(255, {
        message: "A senha deve ter no máximo 255 caracteres",
      }),
    });

    const { email, password } = schemaBody.parse(request.body);

    const user = await userService.login(email, password);

    reply.send(user);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
}

export default {
  register,
  login
};
