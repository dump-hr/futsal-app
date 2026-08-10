import { Injectable } from '@nestjs/common';
import { Observable, Subject, finalize, map } from 'rxjs';

@Injectable()
export class MatchEventStreamService {
  private streams = new Map<number, Subject<number>>();

  private getStream(matchId: number): Subject<number> {
    let stream = this.streams.get(matchId);
    if (!stream) {
      stream = new Subject<number>();
      this.streams.set(matchId, stream);
    }
    return stream;
  }

  emit(matchId: number): void {
    this.streams.get(matchId)?.next(matchId);
  }

  stream(matchId: number): Observable<MessageEvent> {
    const subject = this.getStream(matchId);
    return subject.asObservable().pipe(
      map((id) => ({ data: { matchId: id } }) as MessageEvent),
      finalize(() => {
        if (!subject.observed) this.streams.delete(matchId);
      }),
    );
  }
}
