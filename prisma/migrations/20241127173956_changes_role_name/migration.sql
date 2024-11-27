/*
  Warnings:

  - The `name` column on the `roles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleNames" AS ENUM ('ADMIN', 'CLIENT', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "name",
ADD COLUMN     "name" "RoleNames" NOT NULL DEFAULT 'CLIENT';

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
