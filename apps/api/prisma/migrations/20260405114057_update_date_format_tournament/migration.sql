-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "date" SET DEFAULT TO_CHAR(NOW(), 'MM/YYYY');
