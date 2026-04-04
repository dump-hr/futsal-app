import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchEventService } from './match-event.service';
import {
  MatchEventCreateDto,
  MatchEventUpdateDto,
  MatchEventDto,
} from '@futsal-app/types';

@Controller('match-event')
export class MatchEventController {
  constructor(private readonly matchEventService: MatchEventService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MatchEventUpdateDto,
  ): Promise<MatchEventDto> {
    return await this.matchEventService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<MatchEventDto> {
    return await this.matchEventService.delete(id);
  }
}
