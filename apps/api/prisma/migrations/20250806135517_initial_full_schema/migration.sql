/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('goal', 'ownGoal', 'penaltyGoal', 'penaltyMiss', 'yellowCard', 'redCard', 'injury', 'shootoutGoal', 'shootoutMiss');

-- CreateEnum
CREATE TYPE "public"."MatchType" AS ENUM ('group', 'quarterFinal', 'semiFinal', 'final', 'thirdPlace');

-- DropTable
DROP TABLE "public"."Company";

-- CreateTable
CREATE TABLE "public"."Tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "group" "public"."Group",
    "tournamentId" INTEGER,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Player" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "teamId" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" SERIAL NOT NULL,
    "timeOfMatch" TIMESTAMP(3) NOT NULL,
    "homeTeamId" INTEGER,
    "awayTeamId" INTEGER,
    "homeGoals" INTEGER NOT NULL DEFAULT 0,
    "awayGoals" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatchEvent" (
    "id" SERIAL NOT NULL,
    "minute" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER,
    "eventType" "public"."EventType" NOT NULL,
    "isForHomeTeam" BOOLEAN NOT NULL,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "public"."Team"("name");

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "public"."Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchEvent" ADD CONSTRAINT "MatchEvent_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
