import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  GroupCreateDto,
  GroupUpdateDto,
  GroupDto,
  GroupAddTeamDto,
} from '@futsal-app/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GroupUpdateDto,
  ): Promise<GroupDto> {
    return this.groupService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/team')
  async addTeam(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GroupAddTeamDto,
  ): Promise<GroupDto> {
    return this.groupService.addTeam(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/team/:teamId')
  async removeTeam(
    @Param('id', ParseIntPipe) id: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ): Promise<GroupDto> {
    return this.groupService.removeTeam(id, teamId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<GroupDto> {
    return this.groupService.remove(id);
  }
}
