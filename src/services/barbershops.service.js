import barbershopsRespositorie from "../repositories/barbershops.repositorie.js";
import clientRespositorie from "../repositories/clients.repository.js";
import employeeRespositorie from "../repositories/employees.repository.js";
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

export default {
  getBarbershops,
  getBarbershopById,
  postBarbershop,
  patchBarbershop,
};
