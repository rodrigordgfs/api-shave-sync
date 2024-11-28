import appointmentsRespositorie from "../repositories/appointments.repository.js";
import barbershopsRespositorie from "../repositories/barbershops.repositorie.js";
import barbershopPreferencesRespositorie from "../repositories/barbershopPreferences.repositorie.js";
import employeeRespositorie from "../repositories/employees.repository.js";
import clientRespositorie from "../repositories/clients.repository.js";
import serviceRespositorie from "../repositories/services.repository.js";
import AppError from "../utils/error.js";
import { parse, isBefore, isAfter, addMinutes, parseISO } from "date-fns";

const checkAvailability = (barbershopPreferences, dateTime, duration) => {
  const appointmentDate = parse(dateTime, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  const currentDate = new Date();

  if (isBefore(appointmentDate, currentDate)) {
    throw new AppError("Não é possível agendar para um horário no passado");
  }

  const weekDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    appointmentDate
  );

  const weekDayOperation = barbershopPreferences.weekDaysOperation;

  if (!weekDayOperation.includes(weekDay.toUpperCase())) {
    throw new AppError("Barbearia não abre neste dia");
  }

  validateAppointmentTime(dateTime, duration, barbershopPreferences);

  const intervalOperation = barbershopPreferences.intervalOperation;
  const appointmentMinutes = appointmentDate.getMinutes();

  if (appointmentMinutes % intervalOperation !== 0) {
    throw new AppError("Horário não permitido para agendamentos");
  }
};

const validateAppointmentTime = (dateTime, duration, barbershopPreferences) => {
  const openTime = parse(
    barbershopPreferences.openTime,
    "HH:mm",
    new Date(dateTime)
  );
  const closeTime = parse(
    barbershopPreferences.closeTime,
    "HH:mm",
    new Date(dateTime)
  );

  const appointmentStartTime = new Date(dateTime);
  const appointmentEndTime = addMinutes(appointmentStartTime, duration);

  if (
    isBefore(appointmentStartTime, openTime) ||
    isAfter(appointmentEndTime, closeTime)
  ) {
    throw new AppError("Horário fora do expediente");
  }
};

const checkConflicts = async (employeeId, clientId, dateTime, duration) => {
  const startTime = new Date(dateTime);
  const endTime = addMinutes(startTime, duration);

  const employeeConflicts =
    await appointmentsRespositorie.getAppointmentsByEmployee(
      employeeId,
      startTime,
      endTime
    );
  if (employeeConflicts.length > 0) {
    throw new AppError("Funcionário indisponível neste horário");
  }

  const clientConflicts =
    await appointmentsRespositorie.getAppointmentsByClient(
      clientId,
      startTime,
      endTime
    );
  if (clientConflicts.length > 0) {
    throw new AppError("Cliente já possui um agendamento neste horário");
  }
};

const postAppointment = async (
  barbershopId,
  serviceId,
  employeeId,
  clientId,
  dateTime
) => {
  try {
    const barbershop = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );
    if (!barbershop) {
      throw new AppError("Barbearia não encontrada");
    }

    const barbershopPreferences =
      await barbershopPreferencesRespositorie.getBarbershopPreferences(
        barbershopId
      );

    const service = await serviceRespositorie.getServiceById(serviceId);
    if (!service) {
      throw new AppError("Serviço não encontrado");
    }

    const employee = await employeeRespositorie.getEmployeeById(employeeId);
    if (!employee) {
      throw new AppError("Funcionário não encontrado");
    }

    const client = await clientRespositorie.getClientById(clientId);
    if (!client) {
      throw new AppError("Cliente não encontrado");
    }

    const parsedDateTime = parseISO(dateTime);
    if (isNaN(parsedDateTime)) {
      throw new AppError("Formato de data inválido para dateTime");
    }

    checkAvailability(barbershopPreferences, dateTime, service.duration);

    await checkConflicts(employeeId, clientId, dateTime, service.duration);

    const appointment = await appointmentsRespositorie.postAppointment(
      barbershopId,
      serviceId,
      employeeId,
      clientId,
      parsedDateTime
    );

    return appointment;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getAppointments = async (barbershopId, date) => {
  try {
    const barbershop = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );
    if (!barbershop) {
      throw new AppError("Barbearia não encontrada");
    }

    const appointments =
      await appointmentsRespositorie.getAppointmentsByBarbershopAndDate(
        barbershopId,
        date
      );

    return appointments;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getAppointmentById = async (appointmentId) => {
  try {
    const appointment = await appointmentsRespositorie.getAppointmentById(
      appointmentId
    );
    if (!appointment) {
      throw new AppError("Agendamento não encontrado");
    }

    return appointment;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  postAppointment,
  getAppointments,
  getAppointmentById,
};
