import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Criando 10 Usuários
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: `password${i}`,
      },
    });
    users.push(user);
  }

  // Criando 10 Roles
  const roles = [];
  const roleNames = ["ADMIN", "EMPLOYEE", "CLIENT"];
  for (let i = 1; i <= 3; i++) {
    const role = await prisma.role.create({
      data: {
        name: roleNames[i - 1],
      },
    });
    roles.push(role);
  }

  // Associando usuários a roles (UserRole)
  for (const user of users) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: roles[Math.floor(Math.random() * 3)].id, // Random role
      },
    });
  }

  // Criando 10 Barbershops
  const barbershops = [];
  for (let i = 1; i <= 10; i++) {
    const barbershop = await prisma.barbershops.create({
      data: {
        name: `Barbershop ${i}`,
        address: `Address ${i}`,
        phone: `123456789${i}`,
        profilePicture: `profile${i}.jpg`,
        banner: `banner${i}.jpg`,
        ownerId: users[i % 10].id, // Associando um dono aleatório
      },
    });
    barbershops.push(barbershop);
  }

  // Criando 10 BarbershopPreferences
  for (const barbershop of barbershops) {
    await prisma.barbershopPreferences.create({
      data: {
        barbershopId: barbershop.id,
        openTime: "09:00",
        closeTime: "18:00",
        weekDaysOperation: [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
        ],
        intervalOperation: 30,
      },
    });
  }

  // Criando 10 Clients
  const clients = [];
  for (let i = 1; i <= 10; i++) {
    const client = await prisma.clients.create({
      data: {
        name: `Client ${i}`,
        email: `client${i}@example.com`,
        phone: `987654321${i}`,
        address: `Client Address ${i}`,
        profilePicture: `client${i}.jpg`,
        barbershopId: barbershops[i % 10].id, // Associando um barbershop aleatório
      },
    });
    clients.push(client);
  }

  // Criando 10 Employees
  const employees = [];
  for (let i = 1; i <= 10; i++) {
    const employee = await prisma.employees.create({
      data: {
        name: `Employee ${i}`,
        email: `employee${i}@example.com`,
        phone: `112233445${i}`,
        address: `Employee Address ${i}`,
        profilePicture: `employee${i}.jpg`,
        barbershopId: barbershops[i % 10].id, // Associando um barbershop aleatório
      },
    });
    employees.push(employee);
  }

  // Criando 10 Services
  const services = [];
  for (let i = 1; i <= 10; i++) {
    const service = await prisma.services.create({
      data: {
        name: `Service ${i}`,
        description: `Description for Service ${i}`,
        price: (i + 5) * 10.0, // Preço variando de 10.0 até 150.0
        duration: 30 + (i % 5) * 10, // Duração variando entre 30 e 90 minutos
        image: `service${i}.jpg`,
        barbershopId: barbershops[i % 10].id, // Associando um barbershop aleatório
      },
    });
    services.push(service);
  }

  // Criando 10 Appointments
  for (let i = 1; i <= 10; i++) {
    await prisma.appointments.create({
      data: {
        clientId: clients[i % 10].id,
        employeeId: employees[i % 10].id,
        serviceId: services[i % 10].id,
        date: new Date(),
        status: "pending",
      },
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
