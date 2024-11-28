import { prisma } from "../libs/prisma.js";
import constants from "../utils/constants.js";

const getAppointmentsByEmployee = async (employeeId, startTime, endTime) => {
  try {
    const appointments = await prisma.appointments.findMany({
      where: {
        employeeId,
        AND: [
          {
            dateTime: {
              gte: startTime,
            },
          },
          {
            dateTime: {
              lte: endTime,
            },
          },
        ],
      },
    });
    return appointments;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

const getAppointmentsByClient = async (clientId, startTime, endTime) => {
  try {
    const appointments = await prisma.appointments.findMany({
      where: {
        clientId,
        AND: [
          {
            dateTime: {
              gte: startTime,
            },
          },
          {
            dateTime: {
              lte: endTime,
            },
          },
        ],
      },
    });
    return appointments;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

const postAppointment = async (
  barberShopId,
  serviceId,
  employeeId,
  clientId,
  dateTime
) => {
  try {
    const appointment = await prisma.appointments.create({
      data: {
        barbershop: {
          connect: {
            id: barberShopId,
          },
        },
        service: {
          connect: {
            id: serviceId,
          },
        },
        employee: {
          connect: {
            id: employeeId,
          },
        },
        client: {
          connect: {
            id: clientId,
          },
        },
        dateTime,
      },
      select: {
        id: true,
        barbershop: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            image: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        dateTime: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return appointment;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

const getAppointmentsByBarbershopAndDate = async (barbershopId, date) => {
  try {
    const parsedDate = date ? new Date(date) : undefined;
    const startOfDayDate = parsedDate ? startOfDay(parsedDate) : undefined;
    const endOfDayDate = parsedDate ? endOfDay(parsedDate) : undefined;

    const appointments = await prisma.appointments.findMany({
      where: {
        barbershopId,
        dateTime: parsedDate
          ? { gte: startOfDayDate, lt: endOfDayDate }
          : undefined,
      },
      select: {
        id: true,
        barbershop: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            image: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        dateTime: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return appointments;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

const getAppointmentById = async (appointmentId) => {
  try {
    const appointment = await prisma.appointments.findUnique({
      where: {
        id: appointmentId,
      },
      select: {
        id: true,
        barbershop: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            image: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
        dateTime: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return appointment;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export default {
  getAppointmentsByEmployee,
  getAppointmentsByClient,
  postAppointment,
  getAppointmentsByBarbershopAndDate,
  getAppointmentById,
};
