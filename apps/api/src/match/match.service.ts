import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { MatchDto } from '@futsal-app/types';

@Injectable()
export class MatchService {
  async getById(id: number): Promise<MatchDto> {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            players: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            players: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    return {
      ...match,
      timeOfMatch: match.timeOfMatch.toISOString(),
    };
  }
}
