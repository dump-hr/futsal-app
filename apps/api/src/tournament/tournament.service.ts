import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TournamentModifyDto, TournamentDto } from '@futsal-app/types';

@Injectable()
export class TournamentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: TournamentModifyDto): Promise<TournamentDto> {
    const createdTournament = await this.prisma.tournament.create({
      data: {
        ...dto,
      },
    });

    return createdTournament;
  }

  async getById(id: number): Promise<TournamentDto> {
    const tournament = await this.prisma.tournament.findFirst({
      where: { id },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with id ${id} not found`);
    }

    return tournament;
  }

  async update(id: number, dto: TournamentModifyDto): Promise<TournamentDto> {
    const updatedTournament = await this.prisma.tournament.update({
      where: { id },
      data: { ...dto },
    });

    return updatedTournament;
  }

  async delete(id: number): Promise<TournamentDto> {
    const deletedTournament = await this.prisma.tournament.delete({
      where: { id },
    });

    return deletedTournament;
  }
}
