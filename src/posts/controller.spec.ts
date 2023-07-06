import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './controller';
import { PostsService } from './service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test-utils/repositoryMockFactory';
import { Post } from './entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService, {
        provide: getRepositoryToken(Post), useFactory: repositoryMockFactory
      }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('when creating a post', () => {
    let result: Post;
    const dto: CreatePostDto = {
      title: 'mocked-post-title',
      body: 'mocked-post-body',
    };;

    beforeEach(async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce({
        id: 69,
        ...dto,
      });
      result = await controller.create(dto);
    });

    it('should try to create a post', () => {
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should return created post', () => {
      const expected = {
        id: 69,
        ...dto,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('when finding all posts', () => {
    let result: Post[];
    const mockedPosts = [
      {
        id: 69,
        title: 'mocked-post-title',
        body: 'mocked-post-body',
      },
      {
        id: 420,
        title: 'mocked-post-title',
        body: 'mocked-post-body',
      }
    ];

    beforeEach(async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockedPosts);
      result = await controller.findAll();
    });

    it('should try to find all posts', () => {
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return found posts', () => {
      expect(result).toEqual(mockedPosts);
    });
  });

  describe('when finding one post', () => {
    let result: Post;
    const mockedPost = {
      id: 69,
      title: 'mocked-post-title',
      body: 'mocked-post-body',
    };

    beforeEach(async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockedPost);
      result = await controller.findOne('69');
    });

    it('should try to find one post', () => {
      expect(service.findOne).toHaveBeenCalledWith(69);
    });

    it('should return found post', () => {
      expect(result).toEqual(mockedPost);
    });
  });
  describe('when updating a post', () => {
    let result: Post;
    const mockedUpdatePostDto = {
      title: 'mocked-post-title',
      body: 'mocked-post-body',
    };
    const mockedPost = {
      id: 69,
      title: 'mocked-post-title',
      body: 'mocked-post-body',
    };

    beforeEach(async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockedPost);
      jest.spyOn(service, 'update').mockResolvedValueOnce();
      result = await controller.update('69', mockedUpdatePostDto);
    });

    it('should try to find a post', () => {
      expect(service.findOne).toHaveBeenCalledWith(69);
    });

    it('should try to update a post', () => {
      expect(service.update).toHaveBeenCalledWith(69, mockedUpdatePostDto);
    });

    it('should return updated post', () => {
      expect(result).toEqual(mockedPost);
    });
  });

  describe('when deleting a post', () => {
    let result: Post;
    const mockedPost = {
      id: 69,
      title: 'mocked-post-title',
      body: 'mocked-post-body',
    };

    beforeEach(async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockedPost);
      jest.spyOn(service, 'remove').mockResolvedValueOnce();
      result = await controller.remove('69');
    });

    it('should try to find a post', () => {
      expect(service.findOne).toHaveBeenCalledWith(69);
    });

    it('should try to delete a post', () => {
      expect(service.remove).toHaveBeenCalledWith(69);
    });

    it('should return deleted post', () => {
      expect(result).toEqual(mockedPost);
    });
  });
});
