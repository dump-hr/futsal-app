import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TournamentModifyDto, TournamentDto } from '@futsal-app/types';
import { prisma } from '../../lib/prisma';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class TournamentService {
  async create(dto: TournamentModifyDto): Promise<TournamentDto> {
    try {
      return await prisma.tournament.create({
        data: {
          ...dto,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Turnir s imenom "${dto.name}" već postoji.`,
        );
      }

      throw error;
    }
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
