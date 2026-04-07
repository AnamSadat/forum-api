import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import DeleteCommentUseCase from '../DeleteCommentUseCase';

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengorkestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = vi.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentExist = vi.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentOwner = vi.fn(() => Promise.resolve());

    mockCommentRepository.deleteCommentById = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.owner,
    });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      useCasePayload.commentId,
    );
  });
});
