import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TeamDto } from './team';

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

  teams?: TeamDto[];
}
