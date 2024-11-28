import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const getClientById = async (id) => {
  try {
    const client = await prisma.clients.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return client;
  } catch (error) {
    logError(error);
  }
};

export default {
  getClientById,
};
