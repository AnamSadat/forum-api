import express from 'express';

const createCommentRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postCommentHandler);
  router.delete('/', handler.deleteCommentHandler);

  return router;
};

export default createCommentRouter;
