import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  TeamCreateDto,
  TeamUpdateDto,
  TeamDto,
  TeamPlayersSyncDto,
  PlayerDto,
} from '@futsal-app/types';
import { BlobService } from '../blob/blob.service';
import { prisma } from '../../lib/prisma';
import { buildTeamDtoWithStats, teamWithStatsInclude } from './team.helpers';

@Injectable()
export class TeamService {
  constructor(private readonly blobService: BlobService) {}
  async create(dto: TeamCreateDto): Promise<TeamDto> {
    const existingTeam = await prisma.team.findFirst({
      where: {
        name: dto.name,
        tournamentId: dto.tournamentId,
      },
    });

    if (existingTeam) {
      throw new BadRequestException(
        `Ekipa s imenom "${dto.name}" već postoji u ovom turniru`,
      );
    }

    const team = await prisma.team.create({
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        tournamentId: dto.tournamentId,
        groupId: dto.groupId ?? null,
      },
      include: { group: true },
    });

    return team;
  }

  async getByTournamentId(tournamentId: number): Promise<TeamDto[]> {
    const teams = await prisma.team.findMany({
      where: { tournamentId },
      include: teamWithStatsInclude,
    });

    return teams.map(buildTeamDtoWithStats);
  }

  async getById(id: number): Promise<TeamDto> {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        group: true,
        players: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!team) {
      throw new NotFoundException('Ekipa nije pronađena');
    }

    return team;
  }

  async update(id: number, dto: TeamUpdateDto): Promise<TeamDto> {
    const team = await prisma.team.update({
      where: { id },
      data: {
        name: dto.name,
        logoUrl: dto.logoUrl,
        tournamentId: dto.tournamentId,
        groupId: dto.groupId,
      },
      include: { group: true },
    });

    return team;
  }

  async updateLogo(id: number, file: Express.Multer.File): Promise<TeamDto> {
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
    const matchCount = await prisma.match.count({
      where: {
        OR: [{ homeTeamId: id }, { awayTeamId: id }],
      },
    });

    if (matchCount > 0) {
      throw new BadRequestException(
        'Ekipa se ne može obrisati jer ima odigrane utakmice',
      );
    }

    const team = await prisma.team.delete({
      where: { id },
    });

    return team;
  }

  async syncPlayers(
    teamId: number,
    dto: TeamPlayersSyncDto,
  ): Promise<PlayerDto[]> {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { players: true },
    });

    if (!team) {
      throw new NotFoundException('Ekipa nije pronađena');
    }

    const currentById = new Map(team.players.map((p) => [p.id, p]));
    const payloadIds = new Set(
      dto.players.filter((p) => p.id !== undefined).map((p) => p.id!),
    );

    for (const id of payloadIds) {
      if (!currentById.has(id)) {
        throw new BadRequestException(
          `Igrač s ID-om ${id} ne pripada ovoj ekipi`,
        );
      }
    }

    const toDelete = team.players
      .filter((p) => !payloadIds.has(p.id))
      .map((p) => p.id);

    const toCreate = dto.players.filter((p) => p.id === undefined);

    const toUpdate = dto.players
      .filter((p) => p.id !== undefined)
      .filter((p) => {
        const existing = currentById.get(p.id!)!;
        return (
          existing.firstName !== p.firstName || existing.lastName !== p.lastName
        );
      });

    return prisma.$transaction(async (tx) => {
      if (toDelete.length) {
        await tx.player.deleteMany({ where: { id: { in: toDelete } } });
      }
      for (const p of toUpdate) {
        await tx.player.update({
          where: { id: p.id! },
          data: { firstName: p.firstName, lastName: p.lastName },
        });
      }
      if (toCreate.length) {
        await tx.player.createMany({
          data: toCreate.map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            teamId,
          })),
        });
      }
      return tx.player.findMany({
        where: { teamId },
        orderBy: { id: 'asc' },
      });
    });
  }
}
