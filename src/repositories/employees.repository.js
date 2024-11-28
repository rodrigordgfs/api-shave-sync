import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const getEmployeeById = async (id) => {
  try {
    const employee = await prisma.employees.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return employee;
  } catch (error) {
    logError(error);
  }
};

export default {
  getEmployeeById,
};
