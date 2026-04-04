import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  imports: [AuthModule],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
