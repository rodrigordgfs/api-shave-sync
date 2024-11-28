import barbershopsRespositorie from "../repositories/barbershops.repositorie.js";
import employeeRespositorie from "../repositories/employees.repository.js";
import AppError from "../utils/error.js";

const getBarbershopClients = async (barbershopId) => {
  try {
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const clients = await barbershopsRespositorie.getBarbershopClients(
      barbershopId
    );

    return clients;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getBarbershopClientById = async (barbershopId, clientId) => {
  try {
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const client = await barbershopsRespositorie.getBarbershopClientById(
      barbershopId,
      clientId
    );

    if (!client) {
      throw new AppError("Cliente não encontrado");
    }

    return client;
  } catch (error) {
    throw new AppError(error.message);
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
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const client = await barbershopsRespositorie.postBarbershopClient(
      barbershopId,
      name,
      phone,
      email,
      address,
      profilePicture
    );

    return client;
  } catch (error) {
    throw new AppError(error.message);
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
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const clientExists = await clientRespositorie.getClientById(clientId);

    if (!clientExists) {
      throw new AppError("Cliente não encontrado");
    }

    const client = await barbershopsRespositorie.patchBarbershopClient(
      barbershopId,
      clientId,
      name,
      phone,
      email,
      address,
      profilePicture
    );

    return client;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  getBarbershopClients,
  getBarbershopClientById,
  postBarbershopClient,
  patchBarbershopClient,
};
