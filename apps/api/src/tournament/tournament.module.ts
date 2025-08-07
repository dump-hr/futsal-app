import { Module } from '@nestjs/common';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TournamentController],
  providers: [PrismaService, TournamentService],
})
export class TournamentModule {}
