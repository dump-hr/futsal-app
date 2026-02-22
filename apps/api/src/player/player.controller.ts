import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerDto } from '@futsal-app/types';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('search/:teamId')
  async searchByTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query('q') query: string = '',
  ): Promise<PlayerDto[]> {
    return await this.playerService.searchByTeam(teamId, query);
  }
}
