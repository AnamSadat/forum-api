import LikesHandler from './handler.js';
import createLikeRouter from './routes.js';

export default (container) => {
  const likeHandler = new LikesHandler(container);
  return createLikeRouter(likeHandler);
};
