import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import env from './config';

@Module({
  imports: [MongooseModule.forRoot(env.db.url, {
    dbName: 'pt-balance',
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
