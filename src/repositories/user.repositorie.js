import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const register = async (name, email, password) => {
  try {
    const role = await prisma.role.findFirst({
      where: {
        name: constants.roles.client,
      },
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        UserRole: {
          create: {
            roleId: role.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        UserRole: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        UserRole: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    logError(error);
  }
};

export default {
  register,
  getUserByEmail,
};
