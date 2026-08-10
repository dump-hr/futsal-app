import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MatchTimerController } from './match-timer.controller';
import { MatchTimerService } from './match-timer.service';

@Module({
  imports: [AuthModule],
  controllers: [MatchTimerController],
  providers: [MatchTimerService],
  exports: [MatchTimerService],
})
export class MatchTimerModule {}
