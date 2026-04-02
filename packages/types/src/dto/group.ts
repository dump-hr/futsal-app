import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TeamDto } from './team';

export class GroupCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  tournamentId: number;
}

export class GroupUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class GroupDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  tournamentId: number;

  teams: TeamDto[];
}

export class GroupAddTeamDto {
  @IsInt()
  @IsPositive()
  teamId: number;
}
