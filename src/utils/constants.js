import { RoleNames, StatusAppointment, WeekDays } from "@prisma/client";

const constants = {
  roles: {
    admin: RoleNames.ADMIN,
    client: RoleNames.CLIENT,
    employee: RoleNames.EMPLOYEE,
    owner: RoleNames.OWNER,
  },
  weekDays: {
    monday: WeekDays.MONDAY,
    tuesday: WeekDays.TUESDAY,
    wednesday: WeekDays.WEDNESDAY,
    thursday: WeekDays.THURSDAY,
    friday: WeekDays.FRIDAY,
    saturday: WeekDays.SATURDAY,
    sunday: WeekDays.SUNDAY,
  },
  StatusAppointment: {
    pending: StatusAppointment.pending,
    confirmed: StatusAppointment.confirmed,
    cancelled: StatusAppointment.canceled,
    completed: StatusAppointment.completed,
  },
};

export default constants;
