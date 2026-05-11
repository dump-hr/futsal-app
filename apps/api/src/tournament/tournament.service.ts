import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TournamentModifyDto, TournamentDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';

@Injectable()
export class TournamentService {
  async create(dto: TournamentModifyDto): Promise<TournamentDto> {
    const existing = await prisma.tournament.findFirst({
      where: { name: dto.name, isDeleted: false },
    });

    if (existing) {
      throw new ConflictException(
        `Turnir s imenom "${dto.name}" već postoji.`,
      );
    }

    return await prisma.tournament.create({
      data: { ...dto },
    });
  }

  async getAll(): Promise<TournamentDto[]> {
    return await prisma.tournament.findMany({ where: { isDeleted: false } });
  }

  async getById(id: number): Promise<TournamentDto> {
    const tournament = await prisma.tournament.findFirst({
      where: { id, isDeleted: false },
      include: { groups: { include: { teams: true } }, teams: true },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with id ${id} not found`);
    }

    return tournament;
  }

  async update(id: number, dto: TournamentModifyDto): Promise<TournamentDto> {
    const existing = await prisma.tournament.findFirst({
      where: { name: dto.name, isDeleted: false, NOT: { id } },
    });

    if (existing) {
      throw new ConflictException(
        `Turnir s imenom "${dto.name}" već postoji.`,
      );
    }

    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: { ...dto },
    });

    return updatedTournament;
  }

  async delete(id: number): Promise<TournamentDto> {
    const deletedTournament = await prisma.tournament.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedTournament;
  }
}
