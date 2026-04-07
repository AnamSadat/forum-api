import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe('ThreadRepositoryPostgres', () => {
  let userId;
  let username;

  beforeEach(async () => {
    const randomNum = Math.floor(Math.random() * 100000);
    userId = `user-${randomNum}`;
    username = `dicoding${randomNum}`;
    await UsersTableTestHelper.addUser({
      id: userId,
      username,
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const threadId = `thread-${randomNum}`;
      const newThread = new NewThread({
        title: 'judul',
        body: 'isi',
        owner: userId,
      });

      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById(threadId);
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const threadId = `thread-${randomNum}`;
      const newThread = new NewThread({
        title: 'judul',
        body: 'isi',
        owner: userId,
      });

      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual({
        id: threadId,
        title: 'judul',
        owner: userId,
      });
    });
  });

  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError when thread is not exist', async () => {
      // Arrange
      const threadId = 'must be not found';

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist(threadId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is exist', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const threadId = `thread-${randomNum}`;
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'judul',
        body: 'isi',
        owner: userId,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist(threadId),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const threadId = `thread-${randomNum}`;
      const threadDate = new Date();
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'judul',
        body: 'isi',
        owner: userId,
        date: threadDate,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toHaveProperty('id', threadId);
      expect(thread).toHaveProperty('title', 'judul');
      expect(thread).toHaveProperty('body', 'isi');
      expect(thread).toHaveProperty('date', threadDate);
      expect(thread).toHaveProperty('username', username);
    });
  });
});
