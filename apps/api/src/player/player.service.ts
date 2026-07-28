import { Injectable } from '@nestjs/common';
import { PlayerCreateDto, PlayerUpdateDto, PlayerDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';

@Injectable()
export class PlayerService {
  async create(dto: PlayerCreateDto): Promise<PlayerDto> {
    const player = await prisma.player.create({
      data: { ...dto },
    });

    return player;
  }

  async update(id: number, dto: PlayerUpdateDto): Promise<PlayerDto> {
    const player = await prisma.player.update({
      where: { id },
      data: { ...dto },
    });

    return player;
  }

  async delete(id: number): Promise<PlayerDto> {
    const player = await prisma.player.delete({
      where: { id },
    });

    return player;
  }
}
