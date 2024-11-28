import barbershopsRespositorie from "../repositories/barbershops.repositorie.js";
import employeeRespositorie from "../repositories/employees.repository.js";
import AppError from "../utils/error.js";

const patchBarbershopEmployee = async (
  barbershopId,
  employeeId,
  name,
  email,
  phone,
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

    const employeeExists = await employeeRespositorie.getEmployeeById(
      employeeId
    );

    if (!employeeExists) {
      throw new AppError("Funcionário não encontrado");
    }

    const employee = await barbershopsRespositorie.patchBarbershopEmployee(
      barbershopId,
      employeeId,
      name,
      email,
      phone,
      address,
      profilePicture
    );

    return employee;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const postBarbershopEmployee = async (
  barbershopId,
  name,
  email,
  phone,
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

    const employee = await barbershopsRespositorie.postBarbershopEmployee(
      barbershopId,
      name,
      email,
      phone,
      address,
      profilePicture
    );

    return employee;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getBarbershopEmployees = async (barbershopId) => {
  try {
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const employes = await barbershopsRespositorie.getBarbershopEmployees(
      barbershopId
    );

    return employes;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const getBarbershopEmployeeById = async (barbershopId, employeeId) => {
  try {
    const barbershopExists = await barbershopsRespositorie.getBarbershopById(
      barbershopId
    );

    if (!barbershopExists) {
      throw new AppError("Barbearia não encontrada");
    }

    const employee = await employeeRespositorie.getEmployeeById(employeeId);

    if (!employee) {
      throw new AppError("Funcionário não encontrado");
    }

    return employee;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  patchBarbershopEmployee,
  postBarbershopEmployee,
  getBarbershopEmployees,
  getBarbershopEmployeeById,
};
