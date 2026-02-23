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
    });

    return createdTournament;
  }

  async getById(id: number): Promise<TournamentDto> {
    const tournament = await prisma.tournament.findFirst({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with id ${id} not found`);
    }

    return tournament;
  }

  async update(id: number, dto: TournamentModifyDto): Promise<TournamentDto> {
    const updatedTournament = await prisma.tournament.update({
      where: { id },
      data: { ...dto },
    });

    return updatedTournament;
  }

  async delete(id: number): Promise<TournamentDto> {
    const deletedTournament = await prisma.tournament.delete({
      where: { id },
    });

    return deletedTournament;
  }
}
