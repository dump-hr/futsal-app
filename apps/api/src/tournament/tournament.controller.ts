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
import { TournamentService } from './tournament.service';
import { TournamentDto, TournamentModifyDto } from '@futsal-app/types';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  async create(@Body() dto: TournamentModifyDto): Promise<TournamentDto> {
    return await this.tournamentService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<TournamentDto> {
    //TODO: include teams
    return await this.tournamentService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TournamentModifyDto,
  ): Promise<TournamentDto> {
    return await this.tournamentService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<TournamentDto> {
    return this.tournamentService.delete(id);
  }
}
