import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TournamentModule } from './tournament/tournament.module';
import { MatchEventModule } from './match-event/match-event.module';
import { MatchModule } from './match/match.module';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { GroupModule } from './group/group.module';
import { BlobModule } from './blob/blob.module';

@Module({
  imports: [
    ...(process.env.NODE_ENV !== 'dev'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', '..', 'web', 'dist'),
            exclude: ['/api/{*path}'],
          }),
        ]
      : []),
    TournamentModule,
    MatchModule,
    MatchEventModule,
    PlayerModule,
    TeamModule,
    GroupModule,
    BlobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
