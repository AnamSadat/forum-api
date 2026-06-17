import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import LikeUnlikeUseCase from '../LikeUnlikeUseCase.js';

describe('LikeUnlikeUseCase', () => {
  it('should add a like if it does not exist', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const credentialId = 'user-123';

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExist = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = vi.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeExist = vi.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = vi.fn(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUnlikeUseCase.execute({
      threadId,
      commentId,
      owner: credentialId,
    });

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      threadId,
    );
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
      commentId,
    );
    expect(mockLikeRepository.verifyLikeExist).toHaveBeenCalledWith(
      threadId,
      commentId,
      credentialId,
    );
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(
      threadId,
      commentId,
      credentialId,
    );
  });

  it('should remove a like if it exists', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const credentialId = 'user-123';

    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExist = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = vi.fn(() => Promise.resolve());
    mockLikeRepository.verifyLikeExist = vi.fn(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = vi.fn(() => Promise.resolve());

    const likeUnlikeUseCase = new LikeUnlikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await likeUnlikeUseCase.execute({
      threadId,
      commentId,
      owner: credentialId,
    });

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(
      threadId,
    );
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(
      commentId,
    );
    expect(mockLikeRepository.verifyLikeExist).toHaveBeenCalledWith(
      threadId,
      commentId,
      credentialId,
    );
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
      threadId,
      commentId,
      credentialId,
    );
  });
});
