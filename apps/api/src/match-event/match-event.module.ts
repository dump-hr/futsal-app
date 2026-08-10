import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MatchEventController } from './match-event.controller';
import { MatchEventService } from './match-event.service';
import { MatchEventStreamService } from './match-event-stream.service';

@Module({
  imports: [AuthModule],
  controllers: [MatchEventController],
  providers: [MatchEventService, MatchEventStreamService],
})
export class MatchEventModule {}
