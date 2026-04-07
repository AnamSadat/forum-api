import express from 'express';

const createRepliesRouter = (handler) => {
  const router = express.Router({ mergeParams: true });

  router.post('/', handler.postReplyHandler);
  router.delete('/', handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;
