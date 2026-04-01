import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import {
  MatchDto,
  MatchListDto,
  MatchCreateDto,
  MatchUpdateDto,
} from '@futsal-app/types';

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

  async getAll(tournamentId: number): Promise<MatchListDto[]> {
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

  async getByTeamId(teamId: number): Promise<MatchListDto[]> {
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

  async create(dto: MatchCreateDto): Promise<MatchListDto> {
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

  async update(id: number, dto: MatchUpdateDto): Promise<MatchListDto> {
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

  async delete(id: number): Promise<void> {
    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    await prisma.match.delete({ where: { id } });
  }
}
