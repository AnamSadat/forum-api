import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';

describe('CommentRepositoryPostgres', () => {
  let userId;
  let threadId;

  beforeEach(async () => {
    const randomNum = Math.floor(Math.random() * 100000);
    userId = `user-${randomNum}`;
    threadId = `thread-${randomNum}`;

    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'dicoding-123',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'judul',
      body: 'isi',
      owner: userId,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const commentId = `comment-${randomNum}`;
      const newComment = new NewComment({
        threadId,
        content: 'isi komen',
        owner: userId,
      });

      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const commentId = `comment-${randomNum}`;
      const newComment = {
        threadId,
        content: 'isi komen',
        owner: userId,
      };
      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment =
        await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual({
        id: commentId,
        content: 'isi komen',
        owner: userId,
      });
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      // Arrange
      const commentId = 'must be not found';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExist(commentId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is exist', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const commentId = `comment-${randomNum}`;
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'isi komen',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExist(commentId),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when record with commentId and userId is not exist', async () => {
      // Arrange
      const commentId = 'must be not found';
      const differentUserId = 'lost people';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId,
          userId: differentUserId,
        }),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when record with commentId and userId is exist', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const commentId = `comment-${randomNum}`;
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'isi komen',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId,
          userId,
        }),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const commentId = `comment-${randomNum}`;
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'isi komen',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const result = await CommentsTableTestHelper.findCommentById(commentId);
      expect(result[0]).toHaveProperty('is_deleted', true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const randomNum1 = Math.floor(Math.random() * 100000);
      const commentId1 = `comment-${randomNum1}`;
      const commentDate1 = new Date();
      await CommentsTableTestHelper.addComment({
        id: commentId1,
        threadId,
        content: 'isi komen 1',
        owner: userId,
        date: commentDate1,
      });

      // Add a delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      const randomNum2 = Math.floor(Math.random() * 100000);
      const commentId2 = `comment-${randomNum2}`;
      const commentDate2 = new Date();
      await CommentsTableTestHelper.addComment({
        id: commentId2,
        threadId,
        content: 'isi komen 2',
        owner: userId,
        date: commentDate2,
      });

      await CommentsTableTestHelper.markDeleted(commentId2);

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const comments =
        await commentRepositoryPostgres.getCommentByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(2);

      expect(comments[0]).toHaveProperty('id', commentId1);
      expect(comments[0]).toHaveProperty('username', 'dicoding-123');
      expect(comments[0]).toHaveProperty('date', commentDate1);
      expect(comments[0]).toHaveProperty('content', 'isi komen 1');
      expect(comments[0]).toHaveProperty('is_deleted', false);

      expect(comments[1]).toHaveProperty('id', commentId2);
      expect(comments[1]).toHaveProperty('content', 'isi komen 2');
      expect(comments[1]).toHaveProperty('is_deleted', true);

      expect(comments[0].date.getTime()).toBeLessThanOrEqual(
        comments[1].date.getTime(),
      );
    });
  });
});
