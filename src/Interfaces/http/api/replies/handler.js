import autoBind from 'auto-bind';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';

export default class RepliesHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const { threadId, commentId } = req.params;
      const { content } = req.body;
      const owner = req.user.id;

      const addedReplyUseCase = this._container.getInstance(
        AddReplyUseCase.name,
      );
      const addedReply = await addedReplyUseCase.execute({
        threadId,
        commentId,
        content,
        owner,
      });

      res.status(201).json({
        status: 'success',
        data: {
          addedReply,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const { threadId, commentId, replyId } = req.params;
      const owner = req.user.id;

      const deletedReplyUseCase = this._container.getInstance(
        DeleteReplyUseCase.name,
      );
      await deletedReplyUseCase.execute({
        threadId,
        commentId,
        replyId,
        owner,
      });

      res.status(200).json({
        status: 'success',
        message: 'Balasan berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}
