import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerDto } from '@futsal-app/types';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('by-team/:teamId')
  async getByTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<PlayerDto[]> {
    return await this.playerService.getByTeam(teamId);
  }
}
