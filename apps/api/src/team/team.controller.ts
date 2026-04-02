import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamService } from './team.service';
import { TeamCreateDto, TeamUpdateDto, TeamDto } from '@futsal-app/types';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(@Body() dto: TeamCreateDto): Promise<TeamDto> {
    return await this.teamService.create(dto);
  }

  @Get()
  async getByTournamentId(
    @Query('tournamentId', ParseIntPipe) tournamentId: number,
  ): Promise<TeamDto[]> {
    return await this.teamService.getByTournamentId(tournamentId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return await this.teamService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TeamUpdateDto,
  ): Promise<TeamDto> {
    return await this.teamService.update(id, dto);
  }

  @Patch(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  async updateLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|svg\+xml|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<TeamDto> {
    return await this.teamService.updateLogo(id, file);
  }

  @Delete(':id/logo')
  async deleteLogo(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return await this.teamService.deleteLogo(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<TeamDto> {
    return await this.teamService.delete(id);
  }
}
