import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { PlayerDto } from '@futsal-app/types';

@Injectable()
export class PlayerService {
  async searchByTeam(teamId: number, query: string): Promise<PlayerDto[]> {
    const players = await prisma.player.findMany({
      where: {
        teamId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      take: 10,
    });

    return players;
  }
}
