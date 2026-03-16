import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchDto } from '@futsal-app/types';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<MatchDto> {
    return await this.matchService.getById(id);
  }
}
