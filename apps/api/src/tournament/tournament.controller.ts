import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TournamentService } from './tournament.service';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: TournamentModifyDto): Promise<TournamentDto> {
    return await this.tournamentService.create(dto);
  }

  @Get()
  async getAll(): Promise<TournamentDto[]> {
    return await this.tournamentService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<TournamentDto> {
    return this.tournamentService.delete(id);
  }
}
