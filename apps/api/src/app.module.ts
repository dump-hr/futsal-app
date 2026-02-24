import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TournamentModule } from './tournament/tournament.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
