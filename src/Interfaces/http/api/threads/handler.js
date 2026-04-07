import autoBind from 'auto-bind';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadUseCase from '../../../../Applications/use_case/GetThreadUseCase.js';

export default class ThreadsHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const { title, body } = req.body;
      const owner = req.user.id;

      const addThreadUseCase = this._container.getInstance(
        AddThreadUseCase.name,
      );
      const addedThread = await addThreadUseCase.execute({
        title,
        body,
        owner,
      });

      res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadHandler(req, res, next) {
    try {
      const { threadId } = req.params;

      const getThreadUseCase = this._container.getInstance(
        GetThreadUseCase.name,
      );
      const thread = await getThreadUseCase.execute(threadId);

      res.status(200).json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
