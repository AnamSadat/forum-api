import express from 'express';
import authenticateToken from '../../../../Infrastructures/http/middleware/authenticateToken.js';

const createThreadRouter = (handler) => {
  const router = express.Router();

  router.post('/', authenticateToken, handler.postThreadHandler);
  router.get('/:threadId', handler.getThreadHandler);

  return router;
};

export default createThreadRouter;
