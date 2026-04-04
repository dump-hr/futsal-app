import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  GroupCreateDto,
  GroupUpdateDto,
  GroupDto,
  GroupAddTeamDto,
} from '@futsal-app/types';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() dto: GroupCreateDto): Promise<GroupDto> {
    return this.groupService.create(dto);
  }

  @Get()
  async findAll(): Promise<GroupDto[]> {
    return this.groupService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GroupDto> {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GroupUpdateDto,
  ): Promise<GroupDto> {
    return this.groupService.update(id, dto);
  }

  @Post(':id/team')
  async addTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GroupAddTeamDto,
  ): Promise<GroupDto> {
    return this.groupService.addTeam(id, dto);
  }

  @Delete(':id/team/:teamId')
  async removeTeam(
    @Param('id', ParseIntPipe) id: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<GroupDto> {
    return this.groupService.removeTeam(id, teamId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<GroupDto> {
    return this.groupService.remove(id);
  }
}
