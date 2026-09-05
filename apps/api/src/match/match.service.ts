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
  EventType,
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

const GROUP_MATCH_TYPE: `${MatchType}` = MatchType.group;
const SHOOTOUT_GOAL_EVENT_TYPE: `${EventType}` = EventType.shootoutGoal;

type ShootoutEvent = {
  eventType: `${EventType}`;
  isForHomeTeam: boolean;
};

type MatchWithShootoutEvents = MatchDto & {
  events?: ShootoutEvent[];
};

@Injectable()
export class MatchService {
  constructor(private readonly matchTimerService: MatchTimerService) {}

  private withShootoutGoals(match: MatchWithShootoutEvents): MatchDto {
    const { events = [], ...rest } = match;
    const shootoutGoals = events.reduce(
      (acc, event) => {
        if (event.eventType !== SHOOTOUT_GOAL_EVENT_TYPE) return acc;

        if (event.isForHomeTeam) acc.homeShootoutGoals += 1;
        else acc.awayShootoutGoals += 1;

        return acc;
      },
      { homeShootoutGoals: 0, awayShootoutGoals: 0 },
    );

    return {
      ...rest,
      ...shootoutGoals,
    };
  }

  private normalizeBracketOrder(
    matchType: `${MatchType}`,
    bracketOrder: number | null | undefined,
  ): number | null {
    if (matchType === GROUP_MATCH_TYPE) return null;

    if (typeof bracketOrder !== 'number' || !Number.isInteger(bracketOrder)) {
      throw new BadRequestException(
        'Pozicija u ždrijebu je obavezna za utakmice nokaut faze',
      );
    }

    if (bracketOrder < 1) {
      throw new BadRequestException('Pozicija u ždrijebu mora biti veća od 0');
    }

    return bracketOrder;
  }

  private async getNextBracketOrder(
    tournamentId: number,
    matchType: `${MatchType}`,
  ): Promise<number | null> {
    if (matchType === GROUP_MATCH_TYPE) return null;

    const latestMatch = await prisma.match.findFirst({
      where: {
        matchType,
        bracketOrder: { not: null },
        homeTeam: { tournamentId },
      },
      orderBy: { bracketOrder: 'desc' },
      select: { bracketOrder: true },
    });

    const nextOrder = (latestMatch?.bracketOrder ?? 0) + 1;

    return this.normalizeBracketOrder(matchType, nextOrder);
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
        events: { select: { eventType: true, isForHomeTeam: true } },
      },
    });

    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena');
    }

    return this.withShootoutGoals(match);
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
        events: { select: { eventType: true, isForHomeTeam: true } },
      },
    });

    return matches.map((match) => this.withShootoutGoals(match));
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
        events: { select: { eventType: true, isForHomeTeam: true } },
      },
    });

    return matches.map((match) => this.withShootoutGoals(match));
  }

  async create(dto: MatchCreateDto): Promise<MatchDto> {
    const tournamentId = await this.getTournamentIdForHomeTeam(dto.homeTeamId);
    const bracketOrder = await this.getNextBracketOrder(
      tournamentId,
      dto.matchType,
    );

    if ((dto.matchType as MatchType) === MatchType.group) {
      await this.assertSameGroup(dto.homeTeamId, dto.awayTeamId);
    }

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

    if ((dto.matchType as MatchType) === MatchType.group) {
      if (match.homeTeamId === null || match.awayTeamId === null) {
        throw new BadRequestException(
          'Utakmica grupne faze mora imati obje ekipe',
        );
      }

      await this.assertSameGroup(match.homeTeamId, match.awayTeamId);
    }

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

  private async assertSameGroup(
    homeTeamId: number,
    awayTeamId: number,
  ): Promise<void> {
    const teams = await prisma.team.findMany({
      where: { id: { in: [homeTeamId, awayTeamId] } },
      select: { id: true, groupId: true },
    });

    const homeTeam = teams.find((t) => t.id === homeTeamId);
    const awayTeam = teams.find((t) => t.id === awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new NotFoundException('Ekipa nije pronađena');
    }

    if (
      homeTeam.groupId === null ||
      awayTeam.groupId === null ||
      homeTeam.groupId !== awayTeam.groupId
    ) {
      throw new BadRequestException(
        'Utakmica grupne faze mora biti između ekipa iz iste skupine',
      );
    }
  }

  async setActive(id: number): Promise<void> {
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: { select: { tournamentId: true } },
        awayTeam: { select: { tournamentId: true } },
      },
    });

    if (!match) {
      throw new NotFoundException('Utakmica nije pronađena');
    }

    if (match.isActive) return;

    const tournamentId =
      match.homeTeam?.tournamentId ?? match.awayTeam?.tournamentId;

    if (!tournamentId) {
      throw new BadRequestException('Utakmica nije povezana s turnirom');
    }

    const active = await prisma.match.findFirst({
      where: {
        isActive: true,
        OR: [{ homeTeam: { tournamentId } }, { awayTeam: { tournamentId } }],
      },
    });

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
