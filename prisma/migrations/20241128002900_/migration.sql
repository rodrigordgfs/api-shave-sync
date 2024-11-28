/*
  Warnings:

  - A unique constraint covering the columns `[barbershopId]` on the table `barbershop_preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "barbershop_preferences_barbershopId_key" ON "barbershop_preferences"("barbershopId");
