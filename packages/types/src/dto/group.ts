import {
  IsArray,
  IsInt,
  IsNotEmpty,
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

  @IsArray()
  teams?: TeamDto[];
}

export class GroupAddTeamDto {
  @IsInt()
  @IsPositive()
  teamId: number;
}
