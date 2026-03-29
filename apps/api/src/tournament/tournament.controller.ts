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

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<TournamentDto> {
    //TODO: include teams
    return await this.tournamentService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TournamentModifyDto,
  ): Promise<TournamentDto> {
    return await this.tournamentService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<TournamentDto> {
    return this.tournamentService.delete(id);
  }
}
