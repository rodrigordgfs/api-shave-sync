import barbershopsRespositorie from "../repositories/barbershops.repositorie.js";
import clientRespositorie from "../repositories/clients.repository.js";
import AppError from "../utils/error.js";

const getBarbershops = async () => {
  try {
    const barbershops = await barbershopsRespositorie.getBarbershops();
    return barbershops;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getBarbershopById = async (id) => {
  try {
    const barbershop = await barbershopsRespositorie.getBarbershopById(id);

    if (!barbershop) {
      throw new AppError("Barbearia não encontrada");
    }

    return barbershop;
  } catch (error) {
    throw new AppError(error.message);
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
    const barbershop = await barbershopsRespositorie.postBarbershop(
      name,
      address,
      phone,
      profilePicture,
      banner,
      userId
    );
    return barbershop;
  } catch (error) {
    throw new AppError(error.message);
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
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      id
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const barbershop = await barbershopsRespositorie.patchBarbershop(
      id,
      name,
      address,
      phone,
      profilePicture,
      banner
    );

    return barbershop;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const patchBarbershopPreferences = async (
  barbershopId,
  openTime,
  closeTime,
  intervalOperation,
  weekDaysOperation
) => {
  try {
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const barbershop = await barbershopsRespositorie.patchBarbershopPreferences(
      barbershopId,
      openTime,
      closeTime,
      intervalOperation,
      weekDaysOperation
    );

    return barbershop;
  } catch (error) {
    throw new AppError(error.message);
  }
};

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
  getBarbershops,
  getBarbershopById,
  postBarbershop,
  patchBarbershop,
  patchBarbershopPreferences,
  getBarbershopClients,
  getBarbershopClientById,
  postBarbershopClient,
  patchBarbershopClient,
};
