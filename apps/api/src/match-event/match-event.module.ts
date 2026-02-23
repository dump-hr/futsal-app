import { Module } from '@nestjs/common';
import { MatchEventController } from './match-event.controller';
import { MatchEventService } from './match-event.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MatchEventController],
  providers: [PrismaService, MatchEventService],
})
export class MatchEventModule {}
