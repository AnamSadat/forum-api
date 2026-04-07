import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import NewComment from '../../Domains/comments/entities/NewComment.js';

export default class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);
    const newComment = new NewComment(useCasePayload);
    const addedComment = await this._commentRepository.addComment(newComment);
    return new AddedComment(addedComment);
  }
}
