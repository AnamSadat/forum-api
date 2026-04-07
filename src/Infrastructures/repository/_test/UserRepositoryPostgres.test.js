import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js';
import pool from '../../database/postgres/pool.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const username = `dicoding${randomNum}`;
      await UsersTableTestHelper.addUser({ username });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername(username),
      ).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const username = `dicoding${randomNum}`;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.verifyAvailableUsername(username),
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const userId = `user-${randomNum}`;
      const username = `dicoding${randomNum}`;
      const registerUser = new RegisterUser({
        username,
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById(userId);
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const userId = `user-${randomNum}`;
      const username = `dicoding${randomNum}`;
      const registerUser = new RegisterUser({
        username,
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => randomNum.toString(); // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(
        new RegisteredUser({
          id: userId,
          username,
          fullname: 'Dicoding Indonesia',
        }),
      );
    });
  });

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const username = `dicoding${randomNum}`;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        userRepositoryPostgres.getPasswordByUsername(username),
      ).rejects.toThrowError(InvariantError);
    });

    it('should return username password when user is found', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const username = `dicoding${randomNum}`;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({
        username,
        password: 'secret_password',
      });

      // Action & Assert
      const password =
        await userRepositoryPostgres.getPasswordByUsername(username);
      expect(password).toBe('secret_password');
    });
  });

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const username = `dicoding${randomNum}`;
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        userRepositoryPostgres.getIdByUsername(username),
      ).rejects.toThrowError(InvariantError);
    });

    it('should return user id correctly', async () => {
      // Arrange
      const randomNum = Math.floor(Math.random() * 100000);
      const userId = `user-${randomNum}`;
      const username = `dicoding${randomNum}`;
      await UsersTableTestHelper.addUser({ id: userId, username });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const returnedUserId =
        await userRepositoryPostgres.getIdByUsername(username);

      // Assert
      expect(returnedUserId).toEqual(userId);
    });
  });
});
