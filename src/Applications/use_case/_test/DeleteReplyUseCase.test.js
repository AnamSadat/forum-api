import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import DeleteReplyUseCase from '../DeleteReplyUseCase';

describe('DeleteReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengorkestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = vi.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentExist = vi.fn(() => Promise.resolve());

    mockReplyRepository.verifyReplyExist = vi.fn(() => Promise.resolve());

    mockReplyRepository.verifyReplyOwner = vi.fn(() => Promise.resolve());

    mockReplyRepository.deleteReplyById = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.verifyReplyExist).toBeCalledWith(
      useCasePayload.replyId,
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
      replyId: useCasePayload.replyId,
      userId: useCasePayload.owner,
    });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      useCasePayload.replyId,
    );
  });
});
