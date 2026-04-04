import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TeamDto } from './team';
import { GroupDto } from './group';

export class TournamentModifyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  date: string;
}

export class TournamentDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsArray()
  teams?: TeamDto[];

  @IsOptional()
  @IsArray()
  groups?: GroupDto[];
}
