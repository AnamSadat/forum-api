import request from 'supertest';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import EndpointTestHelper from '../../../../tests/EndpointTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  let accessToken;
  let userId;
  let threadId;
  let commentId;

  beforeEach(async () => {
    const data = await EndpointTestHelper.getAccessTokenAndUserIdHelper();
    accessToken = data.accessToken;
    userId = data.userId;
    threadId = `thread-${Date.now()}-${Math.random()}`;
    commentId = `comment-${Date.now()}-${Math.random()}`;

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
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'Isi reply',
      };

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
      expect(response.body.data.addedReply).toHaveProperty('id');
      expect(response.body.data.addedReply).toHaveProperty(
        'content',
        requestPayload.content,
      );
      expect(response.body.data.addedReply).toHaveProperty('owner', userId);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
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
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const requestPayload = {
        content: 'Isi reply',
      };
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when reply successfully deleted', async () => {
      // Arrange
      const replyId = 'reply-123456';
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment_id: commentId,
        content: 'isi reply',
        owner: userId,
      });

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const replyId = 'dummy';
      const server = await createServer(container);

      // Action
      const response = await request(server).delete(
        `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

      const replyId = 'reply-123456';
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment_id: commentId,
        content: 'isi reply',
        owner: differentUserId,
      });

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual(
        'Anda tidak berhak menghapus reply ini',
      );
    });

    it('should response 404 when reply not found', async () => {
      // Arrange
      const replyId = 'not-exist';
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Reply tidak ditemukan');
    });
  });
});
