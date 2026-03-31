import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TeamDto } from './team';

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

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  teams?: TeamDto[];
}
