import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddReplyUseCase from '../AddReplyUseCase.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengorkestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'isi komen',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = vi.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentExist = vi.fn(() => Promise.resolve());

    mockReplyRepository.addReply = vi.fn(() =>
      Promise.resolve({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
    expect(addedReply).toStrictEqual(mockAddedReply);
  });
});
