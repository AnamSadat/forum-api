import express from 'express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import logger from 'morgan';
import threads from '../../Interfaces/http/api/threads/index.js';
import authenticateToken from './middleware/authenticateToken.js';
import comments from '../../Interfaces/http/api/comments/index.js';
import replies from '../../Interfaces/http/api/replies/index.js';
import likes from '../../Interfaces/http/api/likes/index.js';

const createServer = async (container) => {
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());
  app.use(logger('dev'));

  // Register routes
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', threads(container));
  app.use(
    '/threads/:threadId/comments',
    authenticateToken,
    comments(container),
  );
  app.use(
    '/threads/:threadId/comments/:commentId',
    authenticateToken,
    comments(container),
  );
  app.use(
    '/threads/:threadId/comments/:commentId/replies',
    authenticateToken,
    replies(container),
  );
  app.use(
    '/threads/:threadId/comments/:commentId/replies/:replyId',
    authenticateToken,
    replies(container),
  );
  app.use(
    '/threads/:threadId/comments/:commentId/likes',
    authenticateToken,
    likes(container),
  );

  app.get('/', (req, res) => {
    res.json({
      status: 'success',
      message: 'Forum API is running successfully!!!',
    });
  });

  // Global error handler
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    // console.log(next.app);

    // bila response tersebut error, tangani sesuai kebutuhan
    const translatedError = DomainErrorTranslator.translate(error);

    // penanganan client error secara internal.
    if (translatedError instanceof ClientError) {
      logError(translatedError, error);

      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    // Log server error untuk debugging
    console.error('🚀 ~ Server Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // penanganan server error sesuai kebutuhan
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

const logError = (translatedError, error) => {
  const statusCode = translatedError.statusCode;
  const errorType = error.name;

  if (statusCode === 401) {
    // AuthenticationError
    console.error(`🚀 ~ [401] ${translatedError.message}`, {
      name: errorType,
      statusCode,
      message: error.message,
    });
  } else if (statusCode === 403) {
    // AuthorizationError
    console.error(`🚀 ~ [403] ${translatedError.message}`, {
      name: errorType,
      statusCode,
      message: error.message,
    });
  } else if (statusCode === 404) {
    // NotFoundError
    console.error(`🚀 ~ [404] ${translatedError.message}`, {
      name: errorType,
      statusCode,
      message: error.message,
    });
  } else if (statusCode === 400) {
    // ClientError, InvariantError
    console.error(`🚀 ~ [400] ${translatedError.message}`, {
      name: errorType,
      statusCode,
      message: error.message,
    });
  } else {
    // Server error (500+)
    console.error(`🚀 ~ [${statusCode}] Server Error`, {
      name: errorType,
      statusCode,
      message: error.message,
      stack: error.stack,
    });
  }
};

export default createServer;
