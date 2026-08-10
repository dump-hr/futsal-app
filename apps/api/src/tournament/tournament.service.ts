import { ConflictException, Injectable } from '@nestjs/common';
import { TournamentModifyDto, TournamentDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';

@Injectable()
export class TournamentService {
  async create(dto: TournamentModifyDto): Promise<TournamentDto> {
    const existing = await prisma.tournament.findFirst({
      where: { name: dto.name, isDeleted: false },
    });

    if (existing) {
      throw new ConflictException(`Turnir s imenom "${dto.name}" već postoji.`);
    }

    return await prisma.tournament.create({
      data: { ...dto },
    });
  }

  async getAll(): Promise<TournamentDto[]> {
    const tournaments = await prisma.tournament.findMany({
      where: { isDeleted: false },
    });

    return tournaments.sort((a, b) => {
      const [am, ay] = a.date.split('/').map(Number);
      const [bm, by] = b.date.split('/').map(Number);
      return by - ay || bm - am;
    });
  }

  async delete(id: number): Promise<TournamentDto> {
    const deletedTournament = await prisma.tournament.update({
      where: { id },
      data: { isDeleted: true },
    });

    return deletedTournament;
  }
}
