import AddedReply from '../../Domains/replies/entities/AddedReply.js';
import NewReply from '../../Domains/replies/entities/NewReply.js';

export default class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);
    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);
    const newReply = new NewReply({
      content: useCasePayload.content,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
    });

    const addedReply = await this._replyRepository.addReply(newReply);
    return new AddedReply(addedReply);
  }
}
