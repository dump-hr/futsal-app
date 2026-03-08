import { Injectable, NotFoundException } from '@nestjs/common';
import { TournamentModifyDto, TournamentDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';

@Injectable()
export class TournamentService {
  async create(dto: TournamentModifyDto): Promise<TournamentDto> {
    const createdTournament = await prisma.tournament.create({
      data: {
        ...dto,
      },
      include: {
        teams: true,
      },
    });

    return createdTournament;
  }

  async getById(id: number): Promise<TournamentDto> {
    const tournament = await prisma.tournament.findFirst({
      where: { id },
      include: {
        teams: true,
      },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with id ${id} not found`);
    }

    return tournament;
  }

  async getAll(): Promise<TournamentDto[]> {
    const tournaments = await prisma.tournament.findMany({
      include: {
        teams: true,
      },
    });

    return tournaments;
  }

  async update(id: number, dto: TournamentModifyDto): Promise<TournamentDto> {
    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: { ...dto },
      include: {
        teams: true,
      },
    });

    return updatedTournament;
  }

  async delete(id: number): Promise<TournamentDto> {
    const deletedTournament = await prisma.tournament.delete({
      where: { id },
      include: {
        teams: true,
      },
    });

    return deletedTournament;
  }
}
