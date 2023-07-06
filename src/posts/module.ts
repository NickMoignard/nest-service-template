import { Module } from '@nestjs/common';
import { Post } from './entity';
import { PostsService } from './service';
import { PostsController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule { }
