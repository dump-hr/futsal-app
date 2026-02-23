import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  MatchEventCreateDto,
  MatchEventUpdateDto,
  MatchEventDto,
} from '@futsal-app/types';

@Injectable()
export class MatchEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: MatchEventCreateDto): Promise<MatchEventDto> {
    return await this.prisma.matchEvent.create({
      data: {
        minute: dto.minute,
        matchId: dto.matchId,
        playerId: dto.playerId,
        eventType: dto.eventType,
        isForHomeTeam: dto.isForHomeTeam,
      },
    });
  }

  async getByMatchId(matchId: number): Promise<MatchEventDto[]> {
    return await this.prisma.matchEvent.findMany({
      where: { matchId },
      orderBy: { minute: 'asc' },
    });
  }

  async update(id: number, dto: MatchEventUpdateDto): Promise<MatchEventDto> {
    const existing = await this.prisma.matchEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`MatchEvent with id ${id} not found`);
    }

    return await this.prisma.matchEvent.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: number): Promise<MatchEventDto> {
    const existing = await this.prisma.matchEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`MatchEvent with id ${id} not found`);
    }

    return await this.prisma.matchEvent.delete({
      where: { id },
    });
  }
}
