import authMiddleware from "../middleware/auth.middleware.js";
import { hashPassword } from "../utils/passwordCriptDecript.js";
import userRepositorie from "../repositories/user.repositorie.js";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/error.js";

const checkUserExistsByEmail = async (email) => {
  const user = await userRepositorie.getUserByEmail(email);
  if (user) {
    throw new AppError("Usuário já existe", StatusCodes.CONFLICT);
  }
};

const register = async (name, email, password) => {
  await checkUserExistsByEmail(email);

  const hashedPassword = await hashPassword(password);
  const user = await userRepositorie.register(name, email, hashedPassword);

  user.token = await authMiddleware.generateToken(user.id);

  return user;
};

export default {
  register,
};
