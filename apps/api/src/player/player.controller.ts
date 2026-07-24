import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerService } from './player.service';
import { PlayerCreateDto, PlayerUpdateDto, PlayerDto } from '@futsal-app/types';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: PlayerCreateDto): Promise<PlayerDto> {
    return await this.playerService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PlayerUpdateDto,
  ): Promise<PlayerDto> {
    return await this.playerService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<PlayerDto> {
    return await this.playerService.delete(id);
  }
}
