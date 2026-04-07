import ThreadsHandler from './handler.js';
import createThreadRouter from './routes.js';

export default (container) => {
  const threadsHandler = new ThreadsHandler(container);
  return createThreadRouter(threadsHandler);
};
