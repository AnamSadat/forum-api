import autoBind from 'auto-bind';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

export default class CommentsHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const { threadId } = req.params;
      const { content } = req.body;
      const owner = req.user.id;

      const addedCommentUseCase = await this._container.getInstance(
        AddCommentUseCase.name,
      );
      const addedComment = await addedCommentUseCase.execute({
        threadId,
        content,
        owner,
      });

      res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const { commentId, threadId } = req.params;
      const owner = req.user.id;

      const deleteCommnetUseCase = await this._container.getInstance(
        DeleteCommentUseCase.name,
      );
      await deleteCommnetUseCase.execute({ commentId, threadId, owner });

      res.status(200).json({
        status: 'success',
        message: 'Berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}
