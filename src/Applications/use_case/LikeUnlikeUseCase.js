export default class LikeUnlikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);
    const like = await this._likeRepository.verifyLikeExist(
      useCasePayload.threadId,
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    if (like) {
      await this._likeRepository.deleteLike(
        useCasePayload.threadId,
        useCasePayload.commentId,
        useCasePayload.owner,
      );
    } else {
      await this._likeRepository.addLike(
        useCasePayload.threadId,
        useCasePayload.commentId,
        useCasePayload.owner,
      );
    }
  }
}
