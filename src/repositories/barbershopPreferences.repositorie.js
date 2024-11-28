import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const patchBarbershopPreferences = async (
  barbershopId,
  intervalOperation,
  closeTime,
  openTime,
  weekDaysOperation
) => {
  try {
    const barbershop = await prisma.barbershopPreferences.update({
      where: {
        barbershopId,
      },
      data: {
        intervalOperation,
        closeTime,
        openTime,
        weekDaysOperation,
      },
      select: {
        intervalOperation: true,
        closeTime: true,
        openTime: true,
        weekDaysOperation: true,
      },
    });
    return barbershop;
  } catch (error) {
    logError(error);
  }
};

const getBarbershopPreferences = async (barbershopId) => {
  try {
    const barbershopPreferences = await prisma.barbershopPreferences.findFirst({
      where: {
        barbershopId,
      },
      select: {
        intervalOperation: true,
        closeTime: true,
        openTime: true,
        weekDaysOperation: true,
      },
    });
    return barbershopPreferences;
  } catch (error) {
    logError(error);
  }
}


export default {
  patchBarbershopPreferences,
  getBarbershopPreferences
};
