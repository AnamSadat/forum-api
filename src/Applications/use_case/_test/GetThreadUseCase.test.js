import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository';
import ReplyRepository from '../../../Domains/replies/ReplyRepository';
import ThreadRepository from '../../../Domains/threads/ThreadRepository';
import ThreadDetails from '../../../Domains/threads/entities/ThreadDetails';
import CommentDetails from '../../../Domains/comments/entities/CommentDetails';
import ReplyDetails from '../../../Domains/replies/entities/ReplyDetails';
import GetThreadUseCase from '../GetThreadUseCase';

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengorkestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = vi.fn(() => Promise.resolve());

    mockThreadRepository.getThreadById = vi.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: new Date('2021-08-08T07:59:16.198Z'),
        username: 'dicoding',
      }),
    );

    mockCommentRepository.getCommentByThreadId = vi.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
          is_deleted: false,
        },
        {
          id: 'comment-234',
          username: 'dicoding',
          date: new Date('2021-08-08T07:26:21.338Z'),
          content: 'some racist comment',
          is_deleted: true,
        },
      ]),
    );

    mockReplyRepository.getReplyByCommentId = vi.fn((commentId) => {
      if (commentId === 'comment-123') {
        return Promise.resolve([
          {
            id: 'reply-123',
            content: 'some racist reply',
            date: new Date('2021-08-08T07:59:48.766Z'),
            username: 'johndoe',
            is_deleted: true,
          },
          {
            id: 'reply-234',
            content: 'sebuah balasan',
            date: new Date('2021-08-08T08:07:01.522Z'),
            username: 'dicoding',
            is_deleted: false,
          },
        ]);
      }
      return Promise.resolve([]);
    });

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      useCasePayload,
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(
      useCasePayload,
    );
    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(
      'comment-123',
    );
    expect(mockReplyRepository.getReplyByCommentId).toBeCalledWith(
      'comment-234',
    );

    expect(thread).toEqual(
      new ThreadDetails({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: new Date('2021-08-08T07:59:16.198Z'),
        username: 'dicoding',
        comments: [
          new CommentDetails({
            id: 'comment-123',
            username: 'johndoe',
            date: new Date('2021-08-08T07:22:33.555Z'),
            content: 'sebuah comment',
            is_deleted: false,
            replies: [
              new ReplyDetails({
                id: 'reply-123',
                content: 'some racist reply',
                date: new Date('2021-08-08T07:59:48.766Z'),
                username: 'johndoe',
                is_deleted: true,
              }),
              new ReplyDetails({
                id: 'reply-234',
                content: 'sebuah balasan',
                date: new Date('2021-08-08T08:07:01.522Z'),
                username: 'dicoding',
                is_deleted: false,
              }),
            ],
          }),
          new CommentDetails({
            id: 'comment-234',
            username: 'dicoding',
            date: new Date('2021-08-08T07:26:21.338Z'),
            content: 'some racist comment',
            is_deleted: true,
            replies: [],
          }),
        ],
      }),
    );
  });
});
