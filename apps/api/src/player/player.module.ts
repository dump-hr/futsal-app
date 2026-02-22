import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PlayerController],
  providers: [PrismaService, PlayerService],
})
export class PlayerModule {}
