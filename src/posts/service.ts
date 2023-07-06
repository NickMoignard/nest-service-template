import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Post } from './entity';
import { error } from 'console';
import { PostNotFoundError } from './errors';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepository: Repository<Post>) { }

  create(createPostDto: CreatePostDto) {
    return this.postsRepository.save(createPostDto);
  }

  findAll() {
    return this.postsRepository.find();
  }

  findOne(id: number) {
    return this.postsRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    try {
      await this.postsRepository.update(id, updatePostDto);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new PostNotFoundError();
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.postsRepository.delete(id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new PostNotFoundError();
      }
    }
  }
}
