import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const getBarbershops = async () => {
  try {
    const barbershops = await prisma.barbershops.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        profilePicture: true,
        banner: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        BarbershopPreferences: {
          select: {
            intervalOperation: true,
            closeTime: true,
            openTime: true,
            weekDaysOperation: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return barbershops;
  } catch (error) {
    logError(error);
  }
};

const getBarbershopById = async (id) => {
  try {
    const barbershop = await prisma.barbershops.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        profilePicture: true,
        banner: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        BarbershopPreferences: {
          select: {
            intervalOperation: true,
            closeTime: true,
            openTime: true,
            weekDaysOperation: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return barbershop;
  } catch (error) {
    logError(error);
  }
};

const getBarbershopByUserId = async (userId) => {
  try {
    const barbershop = await prisma.barbershops.findUnique({
      where: {
        userId,
      },
    });
    return barbershop;
  } catch (error) {
    logError(error);
  }
};

const postBarbershop = async (
  name,
  address,
  phone,
  profilePicture,
  banner,
  userId
) => {
  try {
    const { friday, monday, saturday, sunday, thursday, tuesday, wednesday } =
      constants.weekDays;

    const barbershop = await prisma.barbershops.create({
      data: {
        name,
        address,
        phone,
        profilePicture,
        banner,
        user: {
          connect: {
            id: userId,
          },
        },
        BarbershopPreferences: {
          create: {
            intervalOperation: 30,
            closeTime: "18:00",
            openTime: "08:00",
            weekDaysOperation: [
              friday,
              monday,
              saturday,
              sunday,
              thursday,
              tuesday,
              wednesday,
            ],
          },
        },
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        profilePicture: true,
        banner: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        BarbershopPreferences: {
          select: {
            intervalOperation: true,
            closeTime: true,
            openTime: true,
            weekDaysOperation: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const ownerRole = await prisma.role.findUnique({
      where: {
        name: constants.roles.owner,
      },
    });

    const user = await prisma.userRole.update({
      where: {
        userId,
      },
      data: {
        roleId: ownerRole.id,
      },
    });

    return barbershop;
  } catch (error) {
    logError(error);
  }
};

const patchBarbershop = async (
  id,
  name,
  address,
  phone,
  profilePicture,
  banner
) => {
  try {
    const barbershop = await prisma.barbershops.update({
      where: {
        id,
      },
      data: {
        name,
        address,
        phone,
        profilePicture,
        banner,
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        profilePicture: true,
        banner: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        BarbershopPreferences: {
          select: {
            intervalOperation: true,
            closeTime: true,
            openTime: true,
            weekDaysOperation: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    return barbershop;
  } catch (error) {
    logError(error);
  }
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

const getBarbershopClients = async (barbershopId) => {
  try {
    const clients = await prisma.clients.findMany({
      where: {
        barbershopId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return clients;
  } catch (error) {
    logError(error);
  }
};

const getBarbershopClientById = async (barbershopId, clientId) => {
  try {
    const client = await prisma.clients.findUnique({
      where: {
        id: clientId,
        barbershopId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
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

const postBarbershopClient = async (
  barbershopId,
  name,
  phone,
  email,
  address,
  profilePicture
) => {
  try {
    const client = await prisma.clients.create({
      data: {
        name,
        phone,
        email,
        address,
        profilePicture,
        barbershopId,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
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

const patchBarbershopClient = async (
  barbershopId,
  clientId,
  name,
  phone,
  email,
  address,
  profilePicture
) => {
  try {
    const client = await prisma.clients.update({
      where: {
        id: clientId,
        barbershopId,
      },
      data: {
        name,
        phone,
        email,
        address,
        profilePicture,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
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
  getBarbershops,
  getBarbershopById,
  postBarbershop,
  patchBarbershop,
  patchBarbershopPreferences,
  getBarbershopByUserId,
  getBarbershopClients,
  getBarbershopClientById,
  postBarbershopClient,
  patchBarbershopClient,
};
