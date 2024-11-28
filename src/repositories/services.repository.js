// services.repository.js
import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const getServicesByBarbershopId = async (barbershopId) => {
  try {
    const services = await prisma.services.findMany({
      where: {
        barbershopId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        image: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return services;
  } catch (error) {
    logError(error);
  }
};

const getServiceByBarbershopById = async (barbershopId, serviceId) => {
  try {
    const service = await prisma.services.findFirst({
      where: {
        id: serviceId,
        barbershopId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        image: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    logError(error);
  }
};

const postBarberhopService = async (
  barbershopId,
  name,
  description,
  price,
  duration,
  image
) => {
  try {
    const service = await prisma.services.create({
      data: {
        name,
        description,
        price,
        duration,
        image,
        barbershopId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        image: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    logError(error);
  }
};

const patchBarberhopService = async (
  barbershopId,
  serviceId,
  name,
  description,
  price,
  duration,
  image
) => {
  try {
    const service = await prisma.services.update({
      where: {
        id: serviceId,
      },
      data: {
        name,
        description,
        price,
        duration,
        image,
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        image: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return service;
  } catch (error) {
    logError(error);
  }
}

export default {
  getServicesByBarbershopId,
  getServiceByBarbershopById,
  postBarberhopService,
  patchBarberhopService
};
