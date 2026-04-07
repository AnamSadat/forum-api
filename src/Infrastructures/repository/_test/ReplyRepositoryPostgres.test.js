import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';

describe('ReplyRepositoryPostgres', () => {
  let userId;
  let username;
  let threadId;
  let commentId;

  beforeEach(async () => {
    const randomNum = Math.floor(Math.random() * 100000);
    userId = `user-${randomNum}`;
    username = `dicoding${randomNum}`;
    threadId = `thread-${randomNum}`;
    commentId = `comment-${randomNum}`;

    await UsersTableTestHelper.addUser({
      id: userId,
      username,
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'judul',
      body: 'isi',
      owner: userId,
    });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      threadId,
      content: 'isi komen',
      owner: userId,
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const replyId = `reply-${randomNum}`;
      const newReply = new NewReply({
        commentId,
        content: 'isi reply',
        owner: userId,
      });

      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(replyId);
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const replyId = `reply-${randomNum}`;
      const newReply = new NewReply({
        commentId,
        content: 'isi reply',
        owner: userId,
      });

      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual({
        id: replyId,
        content: 'isi reply',
        owner: userId,
      });
    });
  });

  describe('verifyReplyExist function', () => {
    it('should throw NotFoundError when reply is not exist', async () => {
      // Arrange
      const replyId = 'must be not found';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyExist(replyId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is exist', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const replyId = `reply-${randomNum}`;
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment_id: commentId,
        content: 'isi reply',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyExist(replyId),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when record with replyId and userId is not exist', async () => {
      // Arrange
      const replyId = 'must be not found';
      const differentUserId = 'lost people';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId,
          userId: differentUserId,
        }),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when record with replyId and userId is exist', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const replyId = `reply-${randomNum}`;
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment_id: commentId,
        content: 'isi reply',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId,
          userId,
        }),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const replyId = `reply-${randomNum}`;
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment_id: commentId,
        content: 'isi reply',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const result = await RepliesTableTestHelper.findReplyById(replyId);
      expect(result[0]).toHaveProperty('is_deleted', true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      const randomNum1 = Math.floor(Math.random() * 100000);
      const replyId1 = `reply-${randomNum1}`;
      const replyDate1 = new Date();
      await RepliesTableTestHelper.addReply({
        id: replyId1,
        comment_id: commentId,
        content: 'isi reply 1',
        owner: userId,
        date: replyDate1,
      });

      // Add a delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      const randomNum2 = Math.floor(Math.random() * 100000);
      const replyId2 = `reply-${randomNum2}`;
      const replyDate2 = new Date();
      await RepliesTableTestHelper.addReply({
        id: replyId2,
        comment_id: commentId,
        content: 'isi reply 2',
        owner: userId,
        date: replyDate2,
      });

      await RepliesTableTestHelper.markDeleted(replyId2);

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const replies =
        await replyRepositoryPostgres.getRepliesByCommentId(commentId);

      // Assert
      expect(replies).toHaveLength(2);

      expect(replies[0]).toHaveProperty('id', replyId1);
      expect(replies[0]).toHaveProperty('username', username);
      expect(replies[0]).toHaveProperty('date', replyDate1);
      expect(replies[0]).toHaveProperty('content', 'isi reply 1');
      expect(replies[0]).toHaveProperty('is_deleted', false);

      expect(replies[1]).toHaveProperty('id', replyId2);
      expect(replies[1]).toHaveProperty('content', 'isi reply 2');
      expect(replies[1]).toHaveProperty('is_deleted', true);

      expect(replies[0].date.getTime()).toBeLessThanOrEqual(
        replies[1].date.getTime(),
      );
    });
  });
});
