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
import { MatchDto, MatchCreateDto, MatchUpdateDto } from '@futsal-app/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getAll(
    @Query('tournamentId', ParseIntPipe) tournamentId: number,
  ): Promise<MatchDto[]> {
    return await this.matchService.getAll(tournamentId);
  }

  @Get('next')
  async getNextMatch(): Promise<MatchDto | null> {
    return await this.matchService.getNextMatch();
  }

  @Get('active')
  async getActive(): Promise<MatchDto | null> {
    return await this.matchService.getActive();
  }

  @Patch('deactivate')
  @UseGuards(JwtAuthGuard)
  async deactivate(): Promise<void> {
    return await this.matchService.deactivate();
  }

  @Get('team/:teamId')
  async getByTeamId(
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<MatchDto[]> {
    return await this.matchService.getByTeamId(teamId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<MatchDto> {
    return await this.matchService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: MatchCreateDto): Promise<MatchDto> {
    return await this.matchService.create(dto);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard)
  async setActive(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.matchService.setActive(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MatchUpdateDto,
  ): Promise<MatchDto> {
    return await this.matchService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.matchService.delete(id);
  }
}
