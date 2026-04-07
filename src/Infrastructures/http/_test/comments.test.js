import request from 'supertest';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import EndpointTestHelper from '../../../../tests/EndpointTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';

describe('/threads/{threadId}/comments endpoint', () => {
  let accessToken;
  let userId;
  let threadId;

  beforeEach(async () => {
    const data = await EndpointTestHelper.getAccessTokenAndUserIdHelper();
    accessToken = data.accessToken;
    userId = data.userId;
    threadId = `thread-${Date.now()}-${Math.random()}`;

    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'judul',
      body: 'isi',
      owner: data.userId,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Isi komen',
      };

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment).toHaveProperty('id');
      expect(response.body.data.addedComment).toHaveProperty(
        'content',
        requestPayload.content,
      );
      expect(response.body.data.addedComment).toHaveProperty('owner', userId);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const requestPayload = {
        content: 'Isi komen',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when comment successfully deleted', async () => {
      // Arrange
      const commentId = 'comment-123456';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'isi komen',
        owner: userId,
      });

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const commentId = 'dummy';
      const server = await createServer(container);

      // Action
      const response = await request(server).delete(
        `/threads/${threadId}/comments/${commentId}`,
      );

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should response 403 when not authorized', async () => {
      // Arrange
      const differentUserId = 'user-12345';

      await UsersTableTestHelper.addUser({
        id: differentUserId,
        username: 'anotherUser',
        password: 'secret',
        fullname: 'not you',
      });

      const commentId = 'comment-12345';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        content: 'isi komen',
        owner: differentUserId,
      });

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual(
        'Anda tidak berhak menghapus comment ini',
      );
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const commentId = 'not-exist';
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Comment tidak ditemukan');
    });
  });
});
