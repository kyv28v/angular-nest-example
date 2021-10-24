import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { QueryController } from './controllers/query.controller';

import { AppService } from './app.service';
import { DatabaseService } from './services/database.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    QueryController,
  ],
  providers: [
    AppService,
    DatabaseService,
  ],
})
export class AppModule {}
