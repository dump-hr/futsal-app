import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamCreateDto, TeamUpdateDto, TeamDto } from '@futsal-app/types';
import { BlobService } from '../blob/blob.service';
import { prisma } from '../../lib/prisma';

@Injectable()
export class TeamService {
  constructor(private readonly blobService: BlobService) {}
  async create(dto: TeamCreateDto): Promise<TeamDto> {
    const team = await prisma.team.create({
      data: { ...dto },
    });

    return team;
  }

  async getByTournamentId(tournamentId: number): Promise<TeamDto[]> {
    const teams = await prisma.team.findMany({
      where: { tournamentId },
    });

    if (!teams.length) {
      throw new NotFoundException(
        `No teams found for tournament with id ${tournamentId}`,
      );
    }

    return teams;
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

  async updateLogo(
    id: number,
    file: Express.Multer.File,
  ): Promise<TeamDto> {
    const logoUrl = await this.blobService.upload(
      'team-logos',
      file.buffer,
      file.mimetype,
    );

    const team = await prisma.team.update({
      where: { id },
      data: { logoUrl },
    });

    return team;
  }

  async deleteLogo(id: number): Promise<TeamDto> {
    const team = await prisma.team.update({
      where: { id },
      data: { logoUrl: null },
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
