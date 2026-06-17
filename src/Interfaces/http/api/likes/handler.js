import autoBind from 'auto-bind';
import LikeUnlikeUseCase from '../../../../Applications/use_case/LikeUnlikeUseCase.js';

export default class LikesHandler {
  constructor(container) {
    this._container = container;
    autoBind(this);
  }

  async putLikeHandler(req, res, next) {
    try {
      const { threadId, commentId } = req.params;
      const owner = req.user.id;

      const likeUnlikeUseCase = this._container.getInstance(
        LikeUnlikeUseCase.name,
      );
      await likeUnlikeUseCase.execute({
        threadId,
        commentId,
        owner,
      });

      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
