import { CreatePostDto } from "src/posts/dto/create-post.dto";
import { UpdatePostDto } from "src/posts/dto/update-post.dto";
import { Post } from "src/posts/entities/post.entity";

export function mockPost(overrides: Partial<Post> = {}): Post {
    return ({
        id: 69,
        title: 'mocked-post-title',
        body: 'mocked-post-body',
        ...overrides,
    });
}

export function mockUpdatePostDto(overrides: Partial<UpdatePostDto> = {}): UpdatePostDto {
    return ({
        title: 'mocked-post-title',
        body: 'mocked-post-body',
        ...overrides,
    });
}

export function mockCreatePostDto(overrides: Partial<CreatePostDto> = {}): CreatePostDto {
    return ({
        title: 'mocked-post-title',
        body: 'mocked-post-body',
        ...overrides,
    });
}
