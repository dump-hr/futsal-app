import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchDto } from '@futsal-app/types';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number): Promise<MatchDto> {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: { id: true, name: true, logoUrl: true } },
        awayTeam: { select: { id: true, name: true, logoUrl: true } },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    return match as unknown as MatchDto;
  }
}
