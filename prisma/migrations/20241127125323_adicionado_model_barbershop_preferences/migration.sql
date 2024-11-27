-- CreateTable
CREATE TABLE "barbershop_preferences" (
    "id" TEXT NOT NULL,
    "barbershopId" TEXT NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "weekDaysOperation" TEXT[],
    "intervalOperation" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barbershop_preferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "barbershop_preferences" ADD CONSTRAINT "barbershop_preferences_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "barbershops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
