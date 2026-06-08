import { Injectable, NotFoundException } from '@nestjs/common';
import { Observable, Subject, concat, defer, finalize, from, map } from 'rxjs';
import { prisma } from '../../lib/prisma';
import { Match } from '../../generated/prisma/client';
import { MatchTimerStateDto, MatchTimerSyncDto } from '@futsal-app/types';

type TimerStateRow = Pick<
  Match,
  | 'id'
  | 'timerIsRunning'
  | 'timerAccumulatedMs'
  | 'timerStartedAt'
  | 'timerLastSyncedAt'
>;

const toState = (match: TimerStateRow): MatchTimerStateDto => ({
  matchId: match.id,
  isRunning: match.timerIsRunning,
  accumulatedMs: match.timerAccumulatedMs,
  startedAt: match.timerStartedAt,
  lastSyncedAt: match.timerLastSyncedAt,
});

const timerStateSelect = {
  id: true,
  timerIsRunning: true,
  timerAccumulatedMs: true,
  timerStartedAt: true,
  timerLastSyncedAt: true,
};

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
      throw new NotFoundException('Utakmica nije pronađena');
    }

    return toState(match);
  }

  async sync(id: number, dto: MatchTimerSyncDto): Promise<MatchTimerStateDto> {
    const existing = await prisma.match.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Utakmica nije pronađena');
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
    this.streams.get(id)?.next(state);
    return state;
  }

  stream(id: number): Observable<MessageEvent> {
    const initial$ = defer(() => from(this.getState(id)));
    const subject = this.getStream(id);
    const subsequent$ = subject.asObservable();

    return concat(initial$, subsequent$).pipe(
      map((state) => ({ data: state }) as MessageEvent),
      finalize(() => {
        if (!subject.observed) this.streams.delete(id);
      }),
    );
  }
}
