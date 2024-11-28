/*
  Warnings:

  - The `weekDaysOperation` column on the `barbershop_preferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "barbershop_preferences" DROP COLUMN "weekDaysOperation",
ADD COLUMN     "weekDaysOperation" "WeekDays"[] DEFAULT ARRAY[]::"WeekDays"[];
