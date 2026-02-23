import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MatchEventService } from './match-event.service';
import {
  MatchEventCreateDto,
  MatchEventUpdateDto,
  MatchEventDto,
} from '@futsal-app/types';

@Controller('match-event')
export class MatchEventController {
  constructor(private readonly matchEventService: MatchEventService) {}

  @Post()
  async create(@Body() dto: MatchEventCreateDto): Promise<MatchEventDto> {
    return await this.matchEventService.create(dto);
  }

  @Get('match/:matchId')
  async getByMatchId(
    @Param('matchId', ParseIntPipe) matchId: number,
  ): Promise<MatchEventDto[]> {
    return await this.matchEventService.getByMatchId(matchId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MatchEventUpdateDto,
  ): Promise<MatchEventDto> {
    return await this.matchEventService.update(id, dto);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MatchEventDto> {
    return await this.matchEventService.delete(id);
  }
}
