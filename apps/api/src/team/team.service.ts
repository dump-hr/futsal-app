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
        `Team with name "${dto.name}" already exists in this tournament`,
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
      include: {
        group: true,
        players: { select: { id: true } },
        homeMatches: { select: { homeGoals: true, awayGoals: true } },
        awayMatches: { select: { homeGoals: true, awayGoals: true } },
      },
    });

    if (!teams.length) {
      throw new NotFoundException(
        `No teams found for tournament with id ${tournamentId}`,
      );
    }

    return teams.map((team): TeamDto => {
      let score = 0;
      for (const match of team.homeMatches) {
        if (match.homeGoals > match.awayGoals) score += 3;
        else if (match.homeGoals === match.awayGoals) score += 1;
      }
      for (const match of team.awayMatches) {
        if (match.awayGoals > match.homeGoals) score += 3;
        else if (match.awayGoals === match.homeGoals) score += 1;
      }

      return {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        groupId: team.groupId,
        group: team.group,
        tournamentId: team.tournamentId,
        numberOfPlayers: team.players.length,
        numberOfMatchesPlayed:
          team.homeMatches.length + team.awayMatches.length,
        teamScore: score,
      };
    });
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
      throw new NotFoundException(`Team with id ${id} not found`);
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
      throw new NotFoundException(`Team with id ${teamId} not found`);
    }

    const currentById = new Map(team.players.map((p) => [p.id, p]));
    const payloadIds = new Set(
      dto.players.filter((p) => p.id !== undefined).map((p) => p.id!),
    );

    for (const id of payloadIds) {
      if (!currentById.has(id)) {
        throw new BadRequestException(
          `Player ${id} does not belong to team ${teamId}`,
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
