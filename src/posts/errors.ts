export class PostError extends Error { }

export class PostNotFoundError extends PostError {
    constructor(message = 'Post not found') {
        super(message);
    }
}