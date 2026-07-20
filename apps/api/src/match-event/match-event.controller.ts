import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchEventService } from './match-event.service';
import { MatchEventStreamService } from './match-event-stream.service';
import {
  MatchEventCreateDto,
  MatchEventUpdateDto,
  MatchEventDto,
} from '@futsal-app/types';

@Controller('match-event')
export class MatchEventController {
  constructor(
    private readonly matchEventService: MatchEventService,
    private readonly streamService: MatchEventStreamService,
  ) {}

  @Sse('match/:matchId/stream')
  stream(
    @Param('matchId', ParseIntPipe) matchId: number,
  ): Observable<MessageEvent> {
    return this.streamService.stream(matchId);
  }

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
