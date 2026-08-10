import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MatchTimerModule } from '../match-timer/match-timer.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [AuthModule, MatchTimerModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
