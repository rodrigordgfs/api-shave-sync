-- AlterTable
ALTER TABLE "barbershop_preferences" ALTER COLUMN "openTime" DROP NOT NULL,
ALTER COLUMN "closeTime" DROP NOT NULL,
ALTER COLUMN "weekDaysOperation" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "intervalOperation" DROP NOT NULL;
