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
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import {
  MatchDto,
  MatchListDto,
  MatchCreateDto,
  MatchUpdateDto,
} from '@futsal-app/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getAll(
    @Query('tournamentId', ParseIntPipe) tournamentId: number,
  ): Promise<MatchListDto[]> {
    return await this.matchService.getAll(tournamentId);
  }

  @Get('next')
  async getNextMatch(): Promise<MatchDto | null> {
    return await this.matchService.getNextMatch();
  }

  @Get('team/:teamId')
  async getByTeamId(
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<MatchListDto[]> {
    return await this.matchService.getByTeamId(teamId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<MatchDto> {
    return await this.matchService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: MatchCreateDto): Promise<MatchListDto> {
    return await this.matchService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MatchUpdateDto,
  ): Promise<MatchListDto> {
    return await this.matchService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.matchService.delete(id);
  }
}
