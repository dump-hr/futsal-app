import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MatchTimerStateDto, MatchTimerSyncDto } from '@futsal-app/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchTimerService } from './match-timer.service';

@Controller('match')
export class MatchTimerController {
  constructor(private readonly service: MatchTimerService) {}

  @Get(':id/timer')
  async getState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MatchTimerStateDto> {
    return this.service.getState(id);
  }

  @Patch(':id/timer')
  @UseGuards(JwtAuthGuard)
  async sync(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MatchTimerSyncDto,
  ): Promise<MatchTimerStateDto> {
    return this.service.sync(id, dto);
  }

  @Sse(':id/timer/stream')
  stream(@Param('id', ParseIntPipe) id: number): Observable<MessageEvent> {
    return this.service.stream(id);
  }
}
