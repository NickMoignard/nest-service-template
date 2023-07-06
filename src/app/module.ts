import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from '../database/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
