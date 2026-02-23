import { Module } from '@nestjs/common';
import { MatchEventController } from './match-event.controller';
import { MatchEventService } from './match-event.service';

@Module({
  controllers: [MatchEventController],
  providers: [MatchEventService],
})
export class MatchEventModule {}
