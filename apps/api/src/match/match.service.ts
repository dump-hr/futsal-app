import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { MatchDto, MatchCreateDto, MatchUpdateDto } from '@futsal-app/types';

const teamWithPlayersSelect = {
  id: true,
  name: true,
  logoUrl: true,
  players: { select: { id: true, firstName: true, lastName: true } },
};

const teamSelect = {
  id: true,
  name: true,
  logoUrl: true,
};

@Injectable()
export class MatchService {
  async getById(id: number): Promise<MatchDto> {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: teamWithPlayersSelect },
        awayTeam: { select: teamWithPlayersSelect },
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    return match;
  }

  async getAll(tournamentId: number): Promise<MatchDto[]> {
    const matches = await prisma.match.findMany({
      where: {
        homeTeam: { tournamentId },
      },
      orderBy: { timeOfMatch: 'asc' },
      include: {
        homeTeam: { select: teamSelect },
        awayTeam: { select: teamSelect },
      },
    });

    if (!matches.length) {
      throw new NotFoundException(
        `No matches found for tournament with id ${tournamentId}`,
      );
    }

    return matches;
  }

  async getNextMatch(): Promise<MatchDto | null> {
    const match = await prisma.match.findFirst({
      where: { timeOfMatch: { gt: new Date() } },
      orderBy: { timeOfMatch: 'asc' },
      include: {
        homeTeam: { select: teamWithPlayersSelect },
        awayTeam: { select: teamWithPlayersSelect },
      },
    });

    return match;
  }

  async getByTeamId(teamId: number): Promise<MatchDto[]> {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      orderBy: { timeOfMatch: 'asc' },
      include: {
        homeTeam: { select: teamSelect },
        awayTeam: { select: teamSelect },
      },
    });

    if (!matches.length) {
      throw new NotFoundException(
        `No matches found for team with id ${teamId}`,
      );
    }

    return matches;
  }

  async create(dto: MatchCreateDto): Promise<MatchDto> {
    return prisma.match.create({
      data: {
        timeOfMatch: dto.timeOfMatch,
        homeTeamId: dto.homeTeamId,
        awayTeamId: dto.awayTeamId,
        matchType: dto.matchType,
      },
      include: {
        homeTeam: { select: teamSelect },
        awayTeam: { select: teamSelect },
      },
    });
  }

  async update(id: number, dto: MatchUpdateDto): Promise<MatchDto> {
    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    return prisma.match.update({
      where: { id },
      data: dto,
      include: {
        homeTeam: { select: teamSelect },
        awayTeam: { select: teamSelect },
      },
    });
  }

  async getActive(): Promise<MatchDto | null> {
    return prisma.match.findFirst({
      where: { isActive: true },
      include: {
        homeTeam: { select: teamWithPlayersSelect },
        awayTeam: { select: teamWithPlayersSelect },
      },
    });
  }

  async setActive(id: number): Promise<void> {
    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    await prisma.$transaction([
      prisma.match.updateMany({
        where: { isActive: true },
        data: {
          isActive: false,
          timerIsRunning: false,
          timerStartedAt: null,
          timerAccumulatedMs: 0,
          timerLastSyncedAt: null,
        },
      }),
      prisma.match.update({
        where: { id },
        data: {
          isActive: true,
          timerIsRunning: false,
          timerStartedAt: null,
          timerAccumulatedMs: 0,
          timerLastSyncedAt: null,
        },
      }),
    ]);
  }

  async deactivate(): Promise<void> {
    const active = await prisma.match.findFirst({ where: { isActive: true } });

    if (!active) {
      throw new BadRequestException('No active match to deactivate');
    }

    await prisma.match.update({
      where: { id: active.id },
      data: {
        isActive: false,
        timerIsRunning: false,
        timerStartedAt: null,
        timerAccumulatedMs: 0,
        timerLastSyncedAt: null,
      },
    });
  }

  async delete(id: number): Promise<void> {
    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    await prisma.match.delete({ where: { id } });
  }
}
