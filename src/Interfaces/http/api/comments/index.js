import CommentsHandler from './handler.js';
import createCommentRouter from './routes.js';

export default (container) => {
  const commentsHandler = new CommentsHandler(container);
  return createCommentRouter(commentsHandler);
};
