import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PostsService } from './service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entity';
import { PostNotFoundError } from './errors';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    try {
      await this.postsService.update(+id, updatePostDto);
    } catch (error) {
      if (error instanceof PostNotFoundError) {
        throw new NotFoundException();
      }
    }

    return await this.postsService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostEntity> {
    let post: PostEntity;

    try {
      post = await this.postsService.findOne(+id);
    } catch (error) {
      if (error instanceof PostNotFoundError) {
        throw new NotFoundException();
      }
    }

    await this.postsService.remove(+id);

    return post;
  }
}
