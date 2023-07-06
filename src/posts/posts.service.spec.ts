import { Mock } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { randomInt } from 'crypto';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test-utils/repositoryMockFactory';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, {
        provide: getRepositoryToken(Post), useFactory: repositoryMockFactory
      }],
    }).compile();

    postsRepository = module.get(getRepositoryToken(Post));
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a post', () => {
    let result: Post;

    const mockedCreatePostDto = {
      title: 'test',
      body: 'test',
    };

    beforeEach(async () => {

      postsRepository.save.mockResolvedValueOnce({
        id: 69,
        ...mockedCreatePostDto,
      });
      result = await service.create(mockedCreatePostDto);
    });

    it('should try to create a post', () => {
      const expected = {
        title: 'test',
        body: 'test',
      };
      expect(postsRepository.save).toHaveBeenCalledWith(expected);
    });

    it('should return created post', () => {
      expect(result).toEqual({
        id: 69,
        ...mockedCreatePostDto,
      })
    });
  });
});
