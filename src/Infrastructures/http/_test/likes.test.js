import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import LikesTableTestHelper from '../../../../tests/LikesTableHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import container from '../../container.js';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';
import request from 'supertest';

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 401 when attempting to add or remove like without authentication', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await request(server).put(
        `/threads/${threadId}/comments/${commentId}/likes`,
      );

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread does not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await request(server).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // login user
      const loginResponse = await request(server)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });
      const accessToken = loginResponse.body.data.accessToken;

      // Action
      const response = await request(server)
        .put('/threads/xxx/comments/xxx/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Comment tidak ditemukan');
    });

    it('should response 404 when comment does not exist', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await request(server).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // login user
      const loginResponse = await request(server)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });
      const accessToken = loginResponse.body.data.accessToken;

      // add thread
      const addThreadResponse = await request(server)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test',
          body: 'testing',
        });
      const threadId = addThreadResponse.body.data.addedThread.id;

      // Action
      const response = await request(server)
        .put(`/threads/${threadId}/comments/xxx/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Comment tidak ditemukan');
    });

    it('should response 200 and add like', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await request(server).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // login user
      const loginResponse = await request(server)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });
      const accessToken = loginResponse.body.data.accessToken;

      // add thread
      const addThreadResponse = await request(server)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test',
          body: 'testing',
        });
      const threadId = addThreadResponse.body.data.addedThread.id;

      // add comment
      const addCommentResponse = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'testing',
        });
      const commentId = addCommentResponse.body.data.addedComment.id;

      // Action
      const response = await request(server)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual('success');

      const getThreadDetailResponse = await request(server).get(
        `/threads/${threadId}`,
      );
      expect(
        getThreadDetailResponse.body.data.thread.comments[0].likeCount,
      ).toEqual(1);
    });

    it('should response 200 and remove like', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await request(server).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // login user
      const loginResponse = await request(server)
        .post('/authentications')
        .send({
          username: 'dicoding',
          password: 'secret',
        });
      const accessToken = loginResponse.body.data.accessToken;

      // add thread
      const addThreadResponse = await request(server)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test',
          body: 'testing',
        });
      const threadId = addThreadResponse.body.data.addedThread.id;

      // add comment
      const addCommentResponse = await request(server)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content: 'testing',
        });
      const commentId = addCommentResponse.body.data.addedComment.id;

      // add like
      await request(server)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Action
      const response = await request(server)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual('success');

      const getThreadDetailResponse = await request(server).get(
        `/threads/${threadId}`,
      );
      expect(
        getThreadDetailResponse.body.data.thread.comments[0].likeCount,
      ).toEqual(0);
    });
  });
});
