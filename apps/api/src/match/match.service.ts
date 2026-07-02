import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import { MatchDto, MatchCreateDto, MatchUpdateDto } from '@futsal-app/types';
import { MatchTimerService } from '../match-timer/match-timer.service';

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
  group: { select: { id: true, name: true, tournamentId: true } },
};

@Injectable()
export class MatchService {
  constructor(private readonly matchTimerService: MatchTimerService) {}

  async getById(id: number): Promise<MatchDto> {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: teamWithPlayersSelect },
        awayTeam: { select: teamWithPlayersSelect },
      },
    });

    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena');
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
      throw new NotFoundException('Utakmica nije pronađena');
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

  async setActive(id: number): Promise<void> {
    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena');
    }

    if (match.isActive) return;

    const active = await prisma.match.findFirst({ where: { isActive: true } });
    if (active) {
      throw new ConflictException(
        'Druga utakmica je već aktivna, najprije ju deaktivirajte',
      );
    }

    await prisma.match.update({
      where: { id },
      data: {
        isActive: true,
        isFinished: false,
        timerIsRunning: false,
        timerStartedAt: null,
        timerAccumulatedMs: 0,
        timerLastSyncedAt: null,
      },
    });

    this.matchTimerService.emitReset(id);
  }

  async deactivate(): Promise<void> {
    const active = await prisma.match.findFirst({ where: { isActive: true } });

    if (!active) {
      throw new BadRequestException('Nema aktivne utakmice za deaktiviranje');
    }

    await prisma.match.update({
      where: { id: active.id },
      data: {
        isActive: false,
        isFinished: true,
        timerIsRunning: false,
        timerStartedAt: null,
        timerAccumulatedMs: 0,
        timerLastSyncedAt: null,
      },
    });

    this.matchTimerService.emitReset(active.id);
  }

  async delete(id: number): Promise<void> {
    const match = await prisma.match.findUnique({ where: { id } });

    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena');
    }

    await prisma.match.delete({ where: { id } });
  }
}
