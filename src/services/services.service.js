import servicesRespositorie from "../repositories/services.repository.js";
import barbershopRespositorie from "../repositories/barbershops.repositorie.js";
import AppError from "../utils/error.js";

const getServicesByBarbershopId = async (barbershopId) => {
  try {
    const barbershopExists = await barbershopRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const services = await servicesRespositorie.getServicesByBarbershopId(
      barbershopId
    );

    return services;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getServiceByBarbershopById = async (barbershopId, serviceId) => {
  try {
    const barbershopExists = await barbershopRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const service = await servicesRespositorie.getServiceByBarbershopById(
      barbershopId,
      serviceId
    );

    if (!service) {
      throw new AppError("Serviço não encontrado");
    }

    return service;
  } catch (error) {
    throw new AppError(error.message);
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
    const barbershopExists = await barbershopRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const service = await servicesRespositorie.postBarberhopService(
      barbershopId,
      name,
      description,
      price,
      duration,
      image
    );

    return service;
  } catch (error) {
    throw new AppError(error.message);
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
    const barbershopExists = await barbershopRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const service = await servicesRespositorie.getServiceByBarbershopById(
      barbershopId,
      serviceId
    );

    if (!service) {
      throw new AppError("Serviço não encontrado");
    }

    const updatedService = await servicesRespositorie.patchBarberhopService(
      barbershopId,
      serviceId,
      name,
      description,
      price,
      duration,
      image
    );

    return updatedService;
  } catch (error) {
    throw new AppError(error.message);
  }
}

export default {
  getServicesByBarbershopId,
  getServiceByBarbershopById,
  postBarberhopService,
  patchBarberhopService
};
