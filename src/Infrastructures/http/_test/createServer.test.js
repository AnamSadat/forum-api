import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const app = await createServer({});

    // Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.status).toEqual(404);
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena tipe data tidak sesuai',
      );
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      );
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      );
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const app = await createServer(container);

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak tersedia');
    });
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // Add delay to ensure user is committed to database
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await request(app)
        .post('/authentications')
        .send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const app = await createServer(container);

      const response = await request(app)
        .post('/authentications')
        .send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password',
      };
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // Add delay to ensure user is committed to database
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await request(app)
        .post('/authentications')
        .send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'kredensial yang Anda masukkan salah',
      );
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'dicoding',
      };
      const app = await createServer(container);

      const response = await request(app)
        .post('/authentications')
        .send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'harus mengirimkan username dan password',
      );
    });

    it('should response 400 if login payload wrong data type', async () => {
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const app = await createServer(container);

      const response = await request(app)
        .post('/authentications')
        .send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'username dan password harus string',
      );
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      const app = await createServer(container);

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // Add delay to ensure user is committed to database
      await new Promise((resolve) => setTimeout(resolve, 100));

      const loginResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { refreshToken } = loginResponse.body.data;
      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken: 123 });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken: 'invalid_refresh_token' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = await container
        .getInstance(AuthenticationTokenManager.name)
        .createRefreshToken({ username: 'dicoding' });

      const response = await request(app)
        .put('/authentications')
        .send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'refresh token tidak ditemukan di database',
      );
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await request(app)
        .delete('/authentications')
        .send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createServer(container);
      const refreshToken = 'refresh_token';

      const response = await request(app)
        .delete('/authentications')
        .send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'refresh token tidak ditemukan di database',
      );
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createServer(container);

      const response = await request(app).delete('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const app = await createServer({});

    // Action
    const response = await request(app).post('/users').send(requestPayload);

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });

  it('should handle error with statusCode 500 and log correctly', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Import ClientError to create a custom subclass
    const { default: ClientError } =
      await import('../../../Commons/exceptions/ClientError.js');

    // Create a custom ClientError with statusCode 500 to reach logError else branch
    class CustomClientError extends ClientError {
      constructor(message) {
        super(message, 500);
        this.name = 'CustomClientError';
      }
    }

    const mockContainer = {
      getInstance: () => {
        throw new CustomClientError('Internal Server Error');
      },
    };

    const app = await createServer(mockContainer);

    // Action
    const response = await request(app).post('/users').send({
      username: 'test',
      password: 'test',
      fullname: 'Test User',
    });

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual('Internal Server Error');
    // Verify logError was called with the custom error
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[500\] Server Error/),
      expect.any(Object),
    );

    consoleSpy.mockRestore();
  });

  it('should handle non-ClientError and log server error', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockContainer = {
      getInstance: () => {
        throw new Error('Generic Error');
      },
    };

    const app = await createServer(mockContainer);

    // Action
    const response = await request(app).post('/users').send({
      username: 'test',
      password: 'test',
      fullname: 'Test User',
    });

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    // Verify console.error was called for server error
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Server Error'),
      expect.any(Object),
    );

    consoleSpy.mockRestore();
  });

  it('should handle NotFoundError correctly', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error');
    const { default: NotFoundError } =
      await import('../../../Commons/exceptions/NotFoundError.js');

    const mockContainer = {
      getInstance: () => {
        throw new NotFoundError('Thread tidak ditemukan');
      },
    };

    const app = await createServer(mockContainer);

    // Action
    const response = await request(app).post('/users').send({
      username: 'test',
      password: 'test',
      fullname: 'Test User',
    });

    // Assert - verify 404 response is correctly returned
    expect(response.status).toEqual(404);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual('Thread tidak ditemukan');

    // Verify logError was called (which covers the 404 branch)
    const errorLogs = consoleSpy.mock.calls.filter((call) =>
      call[0]?.includes?.('[404]'),
    );
    expect(errorLogs.length).toBeGreaterThan(0);

    consoleSpy.mockRestore();
  });

  it('should handle AuthorizationError correctly', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error');
    const { default: AuthorizationError } =
      await import('../../../Commons/exceptions/AuthorizationError.js');

    const mockContainer = {
      getInstance: () => {
        throw new AuthorizationError(
          'Anda tidak berhak mengakses resource ini',
        );
      },
    };

    const app = await createServer(mockContainer);

    // Action
    const response = await request(app).post('/users').send({
      username: 'test',
      password: 'test',
      fullname: 'Test User',
    });

    // Assert - verify 403 response is correctly returned
    expect(response.status).toEqual(403);
    expect(response.body.status).toEqual('fail');
    expect(response.body.message).toEqual(
      'Anda tidak berhak mengakses resource ini',
    );

    // Verify logError was called (which covers the 403 branch)
    const errorLogs = consoleSpy.mock.calls.filter((call) =>
      call[0]?.includes?.('[403]'),
    );
    expect(errorLogs.length).toBeGreaterThan(0);

    consoleSpy.mockRestore();
  });
});
