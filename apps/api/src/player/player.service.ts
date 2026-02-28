import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { PlayerDto } from '@futsal-app/types';

@Injectable()
export class PlayerService {
  async getByTeam(teamId: number): Promise<PlayerDto[]> {
    const players = await prisma.player.findMany({
      where: { teamId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return players;
  }
}
