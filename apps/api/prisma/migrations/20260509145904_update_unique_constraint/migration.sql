/*
  Warnings:

  - A unique constraint covering the columns `[name,tournamentId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Team_name_key";

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "date" SET DEFAULT TO_CHAR(NOW(), 'MM/YYYY');

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_tournamentId_key" ON "Team"("name", "tournamentId");
