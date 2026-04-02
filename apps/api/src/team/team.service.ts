import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async getByTournamentId(tournamentId: number): Promise<TeamDto[]> {
    const teams = await prisma.team.findMany({
      where: { tournamentId },
      include: {
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

    return teams.map((team) => {
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
      data: { ...dto },
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
}
