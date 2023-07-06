import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test-utils/repositoryMockFactory';
import { UpdatePostDto } from './dto/update-post.dto';
import { mockCreatePostDto, mockPost, mockUpdatePostDto } from '../../test/mocks/post.mock';
import { EntityNotFoundError } from 'typeorm';
import { PostNotFoundError } from './posts.errors';


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

    const mockedCreatePostDto = mockCreatePostDto();

    beforeEach(async () => {

      postsRepository.save.mockResolvedValueOnce({
        id: 69,
        ...mockedCreatePostDto,
      });
      result = await service.create(mockedCreatePostDto);
    });

    it('should try to create a post', () => {
      expect(postsRepository.save).toHaveBeenCalledWith(mockedCreatePostDto);
    });

    it('should return created post', () => {
      expect(result).toEqual({
        id: 69,
        ...mockedCreatePostDto,
      })
    });
  });

  describe('when finding all posts', () => {
    let result: Post[];
    const mockedPosts = [
      mockPost({ id: 69 }),
      mockPost({ id: 420 }),
    ];

    beforeEach(async () => {
      postsRepository.find.mockResolvedValueOnce(mockedPosts);
      result = await service.findAll();
    });

    it('should try to find all posts', () => {
      expect(postsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return found posts', () => {
      expect(result).toEqual(mockedPosts);
    });
  });

  describe('when finding one post', () => {
    let result: Post;
    const mockedPost = mockPost();

    beforeEach(async () => {
      postsRepository.findOneBy.mockResolvedValueOnce(mockedPost);
      result = await service.findOne(69);
    });

    it('should try to find one post', () => {
      expect(postsRepository.findOneBy).toHaveBeenCalledWith({ id: 69 });
    });

    it('should return found post', () => {
      expect(result).toEqual(mockedPost);
    });
  });

  describe('when updating a post', () => {
    describe('and when the post does not exist', () => {
      beforeEach(() => {
        postsRepository.update.mockRejectedValueOnce(new EntityNotFoundError(Post, undefined));
      });

      it('should throw a post not found error', async () => {
        await expect(service.update(69, mockUpdatePostDto())).rejects.toThrowError(PostNotFoundError);
      });
    });

    describe('and when the post exists', () => {
      const mockedUpdatePostDto: UpdatePostDto = mockUpdatePostDto();

      beforeEach(() => {
        postsRepository.update.mockResolvedValueOnce({
          id: 69,
          ...mockedUpdatePostDto,
        });
      });

      it('should update the post', async () => {
        await service.update(69, mockedUpdatePostDto);
        expect(postsRepository.update).toHaveBeenCalledWith(69, mockedUpdatePostDto);
      });

      it('should resolve', async () => {
        await expect(service.update(69, mockedUpdatePostDto)).resolves.toBeUndefined();
      });
    });
  });

  describe('when removing a post', () => {

    describe('and when the post does not exist', () => {
      beforeEach(() => {
        postsRepository.delete.mockRejectedValueOnce(new EntityNotFoundError(Post, undefined));
      });

      it('should throw a post not found error', async () => {
        await expect(service.remove(69)).rejects.toThrowError(PostNotFoundError);
      });
    });

    describe('and when the post exists', () => {
      const mockedPost = mockPost();

      beforeEach(() => {
        postsRepository.delete.mockResolvedValueOnce(mockedPost);
      });

      it('should remove the post', async () => {
        await service.remove(mockedPost.id);
        expect(postsRepository.delete).toHaveBeenCalledWith(mockedPost.id);
      });

      it('should resolve', async () => {
        await expect(service.remove(mockedPost.id)).resolves.toBeUndefined();
      });
    });
  });
});
