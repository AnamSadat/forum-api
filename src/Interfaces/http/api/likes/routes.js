import express from 'express';

const createLikeRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.put('/', handler.putLikeHandler);

  return router;
};

export default createLikeRouter;
