import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { prisma } from '../../lib/prisma';
import {
  MatchDto,
  MatchCreateDto,
  MatchUpdateDto,
  MatchType,
} from '@futsal-app/types';
import { MatchTimerService } from '../match-timer/match-timer.service';

const teamWithPlayersSelect = {
  id: true,
  name: true,
  logoUrl: true,
  groupId: true,
  group: { select: { id: true, name: true, tournamentId: true } },
  players: { select: { id: true, firstName: true, lastName: true } },
};

const teamSelect = {
  id: true,
  name: true,
  logoUrl: true,
  groupId: true,
  group: { select: { id: true, name: true, tournamentId: true } },
};

const BRACKET_ORDER_LIMITS: Partial<Record<`${MatchType}`, number>> = {
  [MatchType.quarterFinal]: 4,
  [MatchType.semiFinal]: 2,
  [MatchType.final]: 1,
  [MatchType.thirdPlace]: 1,
};

const GROUP_MATCH_TYPE: `${MatchType}` = MatchType.group;

@Injectable()
export class MatchService {
  constructor(private readonly matchTimerService: MatchTimerService) {}

  private normalizeBracketOrder(
    matchType: `${MatchType}`,
    bracketOrder: number | null | undefined,
  ): number | null {
    if (matchType === GROUP_MATCH_TYPE) return null;

    const maxOrder = BRACKET_ORDER_LIMITS[matchType];

    if (!maxOrder) return null;

    if (typeof bracketOrder !== 'number' || !Number.isInteger(bracketOrder)) {
      throw new BadRequestException(
        'Pozicija u ždrijebu je obavezna za utakmice nokaut faze',
      );
    }

    if (bracketOrder < 1 || bracketOrder > maxOrder) {
      throw new BadRequestException(
        `Pozicija u ždrijebu za ovaj tip utakmice mora biti između 1 i ${maxOrder}`,
      );
    }

    return bracketOrder;
  }

  private async validateBracketOrderIsAvailable(
    tournamentId: number,
    matchType: `${MatchType}`,
    bracketOrder: number | null,
    excludeMatchId?: number,
  ): Promise<void> {
    if (bracketOrder === null) return;

    const duplicate = await prisma.match.findFirst({
      where: {
        ...(excludeMatchId ? { id: { not: excludeMatchId } } : {}),
        matchType,
        bracketOrder,
        homeTeam: { tournamentId },
      },
    });

    if (duplicate) {
      throw new ConflictException(
        'Utakmica s tom pozicijom u ždrijebu već postoji',
      );
    }
  }

  private async getTournamentIdForHomeTeam(
    homeTeamId: number,
  ): Promise<number> {
    const team = await prisma.team.findUnique({
      where: { id: homeTeamId },
      select: { tournamentId: true },
    });

    if (!team) {
      throw new BadRequestException('Domaća ekipa nije pronađena');
    }

    return team.tournamentId;
  }

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
    const bracketOrder = this.normalizeBracketOrder(
      dto.matchType,
      dto.bracketOrder,
    );
    const tournamentId = await this.getTournamentIdForHomeTeam(dto.homeTeamId);
    await this.validateBracketOrderIsAvailable(
      tournamentId,
      dto.matchType,
      bracketOrder,
    );

    return prisma.match.create({
      data: {
        timeOfMatch: dto.timeOfMatch,
        homeTeamId: dto.homeTeamId,
        awayTeamId: dto.awayTeamId,
        matchType: dto.matchType,
        bracketOrder,
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

    const matchType = dto.matchType ?? match.matchType;
    const bracketOrder = this.normalizeBracketOrder(
      matchType,
      dto.bracketOrder === undefined ? match.bracketOrder : dto.bracketOrder,
    );

    if (!match.homeTeamId) {
      throw new BadRequestException('Domaća ekipa nije pronađena');
    }

    const tournamentId = await this.getTournamentIdForHomeTeam(
      match.homeTeamId,
    );
    await this.validateBracketOrderIsAvailable(
      tournamentId,
      matchType,
      bracketOrder,
      id,
    );

    return prisma.match.update({
      where: { id },
      data: {
        ...dto,
        bracketOrder,
      },
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
