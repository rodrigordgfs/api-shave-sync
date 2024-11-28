import barbershopsRespositorie from "../repositories/barbershops.repositorie.js";
import employeeRespositorie from "../repositories/employees.repository.js";
import AppError from "../utils/error.js";

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

export default {
  patchBarbershopPreferences,
};
