/* istanbul ignore file */
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';

import UsersTableTestHelper from './UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import RepliesTableTestHelper from './RepliesTableTestHelper.js';

const EndpointTestHelper = {
  async getAccessTokenAndUserIdHelper() {
    const server = await createServer(container);
    const randomNumber = Math.floor(Math.random() * 100000);

    const userPayload = {
      username: `user${randomNumber}`,
      password: `secret${randomNumber}`,
      fullname: `full name ${randomNumber}`,
    };

    const responseUser = await request(server).post('/users').send(userPayload);

    if (responseUser.status !== 201) {
      throw new Error(
        `Failed to create user: ${responseUser.status} ${JSON.stringify(responseUser.body)}`,
      );
    }

    // Add delay to ensure the user is committed to the database
    await new Promise((resolve) => setTimeout(resolve, 100));

    const responseAuth = await request(server).post('/authentications').send({
      username: userPayload.username,
      password: userPayload.password,
    });

    if (responseAuth.status !== 201) {
      throw new Error(
        `Failed to authenticate: ${responseAuth.status} ${JSON.stringify(responseAuth.body)}`,
      );
    }

    const { id: userId } = responseUser.body.data.addedUser;
    const { accessToken } = responseAuth.body.data;
    return { accessToken, userId };
  },

  async cleanTables() {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  },
};

export default EndpointTestHelper;
