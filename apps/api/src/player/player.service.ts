import { Injectable } from '@nestjs/common';
import { PlayerCreateDto, PlayerUpdateDto, PlayerDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { PLAYER_GOAL_EVENT_TYPES } from '../team/team.helpers';

@Injectable()
export class PlayerService {
  async getTopScorers(
    tournamentId: number,
    limit: number,
  ): Promise<PlayerDto[]> {
    const { scorers, players } = await prisma.$transaction(
      async (tx) => {
        const scorers = await tx.matchEvent.groupBy({
          by: [Prisma.MatchEventScalarFieldEnum.playerId],
          where: {
            eventType: { in: PLAYER_GOAL_EVENT_TYPES },
            player: { team: { tournamentId } },
            match: {
              OR: [
                { homeTeam: { tournamentId } },
                { awayTeam: { tournamentId } },
              ],
            },
          },
          _count: { _all: true },
          orderBy: [
            { _count: { playerId: Prisma.SortOrder.desc } },
            { playerId: Prisma.SortOrder.asc },
          ],
          take: limit,
        });

        const players = await tx.player.findMany({
          where: { id: { in: scorers.map((scorer) => scorer.playerId!) } },
          include: { team: true },
        });
        return { scorers, players };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );

    return scorers.map((scorer): PlayerDto => {
      const player = players.find((player) => player.id === scorer.playerId)!;

      return {
        ...player,
        goals: scorer._count._all,
      };
    });
  }

  async create(dto: PlayerCreateDto): Promise<PlayerDto> {
    const player = await prisma.player.create({
      data: { ...dto },
    });

    return player;
  }

  async update(id: number, dto: PlayerUpdateDto): Promise<PlayerDto> {
    const player = await prisma.player.update({
      where: { id },
      data: { ...dto },
    });

    return player;
  }

  async delete(id: number): Promise<PlayerDto> {
    const player = await prisma.player.delete({
      where: { id },
    });

    return player;
  }
}
