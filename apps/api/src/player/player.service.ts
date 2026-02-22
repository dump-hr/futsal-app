import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlayerDto } from '@futsal-app/types';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async searchByTeam(
    teamId: number,
    query: string,
  ): Promise<PlayerDto[]> {
    const players = await this.prisma.player.findMany({
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
