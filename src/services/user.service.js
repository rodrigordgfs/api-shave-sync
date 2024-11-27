import authMiddleware from "../middleware/auth.middleware.js";
import { hashPassword, verifyPassword } from "../utils/passwordCriptDecript.js";
import userRepositorie from "../repositories/user.repositorie.js";
import AppError from "../utils/error.js";

const register = async (name, email, password) => {
  const userExists = await userRepositorie.getUserByEmail(email);
  if (userExists) {
    throw new AppError("Usuário já existe");
  }

  const hashedPassword = await hashPassword(password);
  const user = await userRepositorie.register(name, email, hashedPassword);

  user.token = await authMiddleware.generateToken(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.UserRole[0]?.role.name,
    token: user.token,
  };
};

const login = async (email, password) => {
  const user = await userRepositorie.getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new AppError("Email ou senha incorreto");
  }

  user.token = await authMiddleware.generateToken(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.UserRole[0]?.role.name,
    token: user.token,
  };
};

export default {
  register,
  login,
};
