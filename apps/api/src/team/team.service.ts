import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamCreateDto, TeamUpdateDto, TeamDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';

@Injectable()
export class TeamService {
  async create(dto: TeamCreateDto): Promise<TeamDto> {
    const team = await prisma.team.create({
      data: { ...dto },
    });

    return team;
  }

  async getById(id: number): Promise<TeamDto> {
    const team = await prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }

    return team;
  }

  async update(id: number, dto: TeamUpdateDto): Promise<TeamDto> {
    const team = await prisma.team.update({
      where: { id },
      data: { ...dto },
    });

    return team;
  }

  async delete(id: number): Promise<TeamDto> {
    const team = await prisma.team.delete({
      where: { id },
    });

    return team;
  }
}
