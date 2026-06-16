import {
  IsArray,
  IsBoolean,
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
}

export class TournamentDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  teams?: TeamDto[];

  @IsOptional()
  @IsArray()
  groups?: GroupDto[];

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsBoolean()
  isDeleted: boolean;
}
