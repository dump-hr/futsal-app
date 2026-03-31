import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GroupCreateDto,
  GroupUpdateDto,
  GroupDto,
  GroupAddTeamDto,
} from '@futsal-app/types';
import { prisma } from '../../lib/prisma';

@Injectable()
export class GroupService {
  async create(dto: GroupCreateDto): Promise<GroupDto> {
    return prisma.group.create({
      data: dto,
      include: { teams: true },
    });
  }

  async findAll(): Promise<GroupDto[]> {
    return prisma.group.findMany({
      include: { teams: true },
    });
  }

  async findOne(id: number): Promise<GroupDto> {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { teams: true },
    });

    if (!group) {
      throw new NotFoundException(`Group with id ${id} not found`);
    }

    return group;
  }

  async update(id: number, dto: GroupUpdateDto): Promise<GroupDto> {
    return prisma.group.update({
      where: { id },
      data: dto,
      include: { teams: true },
    });
  }

  async addTeam(groupId: number, dto: GroupAddTeamDto): Promise<GroupDto> {
    await prisma.team.update({
      where: { id: dto.teamId },
      data: { groupId },
    });

    return this.findOne(groupId);
  }

  async removeTeam(groupId: number, teamId: number): Promise<GroupDto> {
    await prisma.team.update({
      where: { id: teamId, groupId },
      data: { groupId: null },
    });

    return this.findOne(groupId);
  }

  async remove(id: number): Promise<GroupDto> {
    return prisma.group.delete({
      where: { id },
      include: { teams: true },
    });
  }
}
