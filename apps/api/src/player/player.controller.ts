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
import { PlayerService } from './player.service';
import { PlayerCreateDto, PlayerUpdateDto, PlayerDto } from '@futsal-app/types';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(@Body() dto: PlayerCreateDto): Promise<PlayerDto> {
    return await this.playerService.create(dto);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto> {
    return await this.playerService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PlayerUpdateDto,
  ): Promise<PlayerDto> {
    return await this.playerService.update(id, dto);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto> {
    return await this.playerService.delete(id);
  }
}
