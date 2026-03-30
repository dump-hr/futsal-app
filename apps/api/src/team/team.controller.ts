import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamCreateDto, TeamUpdateDto, TeamDto } from '@futsal-app/types';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(@Body() dto: TeamCreateDto): Promise<TeamDto> {
    return await this.teamService.create(dto);
  }

  @Get()
  async getByTournamentId(
    @Query('tournamentId', ParseIntPipe) tournamentId: number,
  ): Promise<TeamDto[]> {
    return await this.teamService.getByTournamentId(tournamentId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return await this.teamService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TeamUpdateDto,
  ): Promise<TeamDto> {
    return await this.teamService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return await this.teamService.delete(id);
  }
}
