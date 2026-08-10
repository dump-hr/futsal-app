import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  MatchEventCreateDto,
  MatchEventUpdateDto,
  MatchEventDto,
} from '@futsal-app/types';
import { isGoalEvent, getScoreChange } from './match-event.helpers';
import { MatchEventStreamService } from './match-event-stream.service';

@Injectable()
export class MatchEventService {
  private readonly logger = new Logger(MatchEventService.name);

  constructor(private readonly stream: MatchEventStreamService) {}

  async create(dto: MatchEventCreateDto): Promise<MatchEventDto> {
    const event = prisma.matchEvent.create({
      data: {
        minute: dto.minute,
        matchId: dto.matchId,
        playerId: dto.playerId,
        eventType: dto.eventType,
        isForHomeTeam: dto.isForHomeTeam,
      },
    });

    if (!isGoalEvent(dto.eventType)) {
      const created = await event;
      this.stream.emit(dto.matchId);
      return created;
    }

    const delta = getScoreChange(dto.eventType, dto.isForHomeTeam);
    try {
      const [created] = await prisma.$transaction([
        event,
        prisma.match.update({
          where: { id: dto.matchId },
          data: {
            homeGoals: { increment: delta.homeGoals },
            awayGoals: { increment: delta.awayGoals },
          },
        }),
      ]);

      this.stream.emit(dto.matchId);
      return created;
    } catch (error) {
      this.logger.error(
        `Failed to create event and update score for match ${dto.matchId}`,
        error,
      );
      throw error;
    }
  }

  async getByMatchId(matchId: number): Promise<MatchEventDto[]> {
    const events = await prisma.matchEvent.findMany({
      where: { matchId },
      orderBy: [{ minute: 'asc' }, { id: 'asc' }],
      include: {
        player: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return events;
  }

  async update(id: number, dto: MatchEventUpdateDto): Promise<MatchEventDto> {
    const existing = await prisma.matchEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Event nije pronađen');
    }

    const newEventType = dto.eventType ?? existing.eventType;
    const eventTypeChanged =
      dto.eventType && dto.eventType !== existing.eventType;

    const updateOp = prisma.matchEvent.update({
      where: { id },
      data: { ...dto },
    });

    if (!eventTypeChanged) {
      const updated = await updateOp;
      this.stream.emit(existing.matchId);
      return updated;
    }

    const operations: Prisma.PrismaPromise<unknown>[] = [updateOp];

    if (isGoalEvent(existing.eventType)) {
      const oldDelta = getScoreChange(
        existing.eventType,
        existing.isForHomeTeam,
      );
      operations.push(
        prisma.match.update({
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
        prisma.match.update({
          where: { id: existing.matchId },
          data: {
            homeGoals: { increment: newDelta.homeGoals },
            awayGoals: { increment: newDelta.awayGoals },
          },
        }),
      );
    }

    try {
      const [updated] = await prisma.$transaction(operations);

      this.stream.emit(existing.matchId);
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
    const existing = await prisma.matchEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Event nije pronađen');
    }

    const deleteOp = prisma.matchEvent.delete({ where: { id } });

    if (!isGoalEvent(existing.eventType)) {
      const deleted = await deleteOp;
      this.stream.emit(existing.matchId);
      return deleted;
    }

    const delta = getScoreChange(existing.eventType, existing.isForHomeTeam);

    try {
      const [deleted] = await prisma.$transaction([
        deleteOp,
        prisma.match.update({
          where: { id: existing.matchId },
          data: {
            homeGoals: { decrement: delta.homeGoals },
            awayGoals: { decrement: delta.awayGoals },
          },
        }),
      ]);

      this.stream.emit(existing.matchId);
      return deleted;
    } catch (error) {
      this.logger.error(
        `Failed to delete event ${id} and sync score for match ${existing.matchId}`,
        error,
      );
      throw error;
    }
  }
}
