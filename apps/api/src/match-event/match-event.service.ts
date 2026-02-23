import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { type PrismaPromise } from '@prisma/client';
import {
  MatchEventCreateDto,
  MatchEventUpdateDto,
  MatchEventDto,
} from '@futsal-app/types';
import { isGoalEvent, getScoreChange } from './match-event.helpers';

@Injectable()
export class MatchEventService {
  private readonly logger = new Logger(MatchEventService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: MatchEventCreateDto): Promise<MatchEventDto> {
    const event = this.prisma.matchEvent.create({
      data: {
        minute: dto.minute,
        matchId: dto.matchId,
        playerId: dto.playerId,
        eventType: dto.eventType,
        isForHomeTeam: dto.isForHomeTeam,
      },
    });

    if (!isGoalEvent(dto.eventType)) {
      return (await event) as unknown as MatchEventDto;
    }

    const delta = getScoreChange(dto.eventType, dto.isForHomeTeam);
    try {
      const [created] = await this.prisma.$transaction([
        event,
        this.prisma.match.update({
          where: { id: dto.matchId },
          data: {
            homeGoals: { increment: delta.homeGoals },
            awayGoals: { increment: delta.awayGoals },
          },
        }),
      ]);

      return created as unknown as MatchEventDto;
    } catch (error) {
      this.logger.error(
        `Failed to create event and update score for match ${dto.matchId}`,
        error,
      );
      throw error;
    }
  }

  async getByMatchId(matchId: number): Promise<MatchEventDto[]> {
    return (await this.prisma.matchEvent.findMany({
      where: { matchId },
      orderBy: [{ minute: 'asc' }, { id: 'asc' }],
      include: {
        player: { select: { id: true, firstName: true, lastName: true } },
      },
    })) as unknown as MatchEventDto[];
  }

  async update(id: number, dto: MatchEventUpdateDto): Promise<MatchEventDto> {
    const existing = await this.prisma.matchEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`MatchEvent with id ${id} not found`);
    }

    const newEventType = dto.eventType ?? existing.eventType;
    const eventTypeChanged =
      dto.eventType && dto.eventType !== existing.eventType;

    const updateOp = this.prisma.matchEvent.update({
      where: { id },
      data: { ...dto },
    });

    if (!eventTypeChanged) {
      return (await updateOp) as unknown as MatchEventDto;
    }

    const operations: PrismaPromise<unknown>[] = [updateOp];

    if (isGoalEvent(existing.eventType)) {
      const oldDelta = getScoreChange(
        existing.eventType,
        existing.isForHomeTeam,
      );
      operations.push(
        this.prisma.match.update({
          where: { id: existing.matchId },
          data: {
            homeGoals: { decrement: oldDelta.homeGoals },
            awayGoals: { decrement: oldDelta.awayGoals },
          },
        }),
      );
    }

    if (isGoalEvent(newEventType)) {
      const newDelta = getScoreChange(newEventType, existing.isForHomeTeam);
      operations.push(
        this.prisma.match.update({
          where: { id: existing.matchId },
          data: {
            homeGoals: { increment: newDelta.homeGoals },
            awayGoals: { increment: newDelta.awayGoals },
          },
        }),
      );
    }

    try {
      const [updated] = await this.prisma.$transaction(operations);

      return updated as MatchEventDto;
    } catch (error) {
      this.logger.error(
        `Failed to update event ${id} and sync score for match ${existing.matchId}`,
        error,
      );
      throw error;
    }
  }

  async delete(id: number): Promise<MatchEventDto> {
    const existing = await this.prisma.matchEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`MatchEvent with id ${id} not found`);
    }

    const deleteOp = this.prisma.matchEvent.delete({ where: { id } });

    if (!isGoalEvent(existing.eventType)) {
      return (await deleteOp) as unknown as MatchEventDto;
    }

    const delta = getScoreChange(existing.eventType, existing.isForHomeTeam);
    const match = await this.prisma.match.findUnique({
      where: { id: existing.matchId },
    });

    try {
      const [deleted] = await this.prisma.$transaction([
        deleteOp,
        this.prisma.match.update({
          where: { id: existing.matchId },
          data: {
            homeGoals: Math.max(0, (match?.homeGoals ?? 0) - delta.homeGoals),
            awayGoals: Math.max(0, (match?.awayGoals ?? 0) - delta.awayGoals),
          },
        }),
      ]);

      return deleted as unknown as MatchEventDto;
    } catch (error) {
      this.logger.error(
        `Failed to delete event ${id} and sync score for match ${existing.matchId}`,
        error,
      );
      throw error;
    }
  }
}
