import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeamService } from './team.service';
import {
  TeamCreateDto,
  TeamUpdateDto,
  TeamDto,
  TeamPlayersSyncDto,
  PlayerDto,
} from '@futsal-app/types';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TeamUpdateDto,
  ): Promise<TeamDto> {
    return await this.teamService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return await this.teamService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/players')
  async syncPlayers(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TeamPlayersSyncDto,
  ): Promise<PlayerDto[]> {
    return await this.teamService.syncPlayers(id, dto);
  }
}
