-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "timerAccumulatedMs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timerIsRunning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timerLastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "timerStartedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "date" SET DEFAULT TO_CHAR(NOW(), 'MM/YYYY');
