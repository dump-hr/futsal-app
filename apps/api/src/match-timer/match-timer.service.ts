import { Injectable, NotFoundException } from '@nestjs/common';
import { Observable, Subject, concat, defer, from, map } from 'rxjs';
import { prisma } from '../../lib/prisma';
import { MatchTimerStateDto, MatchTimerSyncDto } from '@futsal-app/types';

const timerStateSelect = {
  id: true,
  timerIsRunning: true,
  timerAccumulatedMs: true,
  timerStartedAt: true,
  timerLastSyncedAt: true,
} as const;

const toState = (match: {
  id: number;
  timerIsRunning: boolean;
  timerAccumulatedMs: number;
  timerStartedAt: Date | null;
  timerLastSyncedAt: Date | null;
}): MatchTimerStateDto => ({
  matchId: match.id,
  isRunning: match.timerIsRunning,
  accumulatedMs: match.timerAccumulatedMs,
  startedAt: match.timerStartedAt,
  lastSyncedAt: match.timerLastSyncedAt,
});

@Injectable()
export class MatchTimerService {
  private streams = new Map<number, Subject<MatchTimerStateDto>>();

  private getStream(matchId: number): Subject<MatchTimerStateDto> {
    let stream = this.streams.get(matchId);

    if (!stream) {
      stream = new Subject<MatchTimerStateDto>();
      this.streams.set(matchId, stream);
    }
    return stream;
  }

  async getState(id: number): Promise<MatchTimerStateDto> {
    const match = await prisma.match.findUnique({
      where: { id },
      select: timerStateSelect,
    });

    if (!match) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    return toState(match);
  }

  async sync(id: number, dto: MatchTimerSyncDto): Promise<MatchTimerStateDto> {
    const existing = await prisma.match.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Match with id ${id} not found`);
    }

    const now = new Date();
    const updated = await prisma.match.update({
      where: { id },
      data: {
        timerIsRunning: dto.isRunning,
        timerAccumulatedMs: dto.accumulatedMs,
        timerStartedAt: dto.isRunning ? now : null,
        timerLastSyncedAt: now,
      },
      select: timerStateSelect,
    });

    const state = toState(updated);
    this.getStream(id).next(state);
    return state;
  }

  stream(id: number): Observable<MessageEvent> {
    const initial$ = defer(() => from(this.getState(id)));
    const subsequent$ = this.getStream(id).asObservable();

    return concat(initial$, subsequent$).pipe(
      map((state) => ({ data: state }) as MessageEvent),
    );
  }
}
