import CommentDetails from '../../Domains/comments/entities/CommentDetails.js';
import ReplyDetails from '../../Domains/replies/entities/ReplyDetails.js';
import ThreadDetails from '../../Domains/threads/entities/ThreadDetails.js';

export default class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload);

    const thread = await this._threadRepository.getThreadById(useCasePayload);

    const comments =
      await this._commentRepository.getCommentByThreadId(useCasePayload);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getReplyByCommentId(
          comment.id,
        );
        const formattedRepiles = replies.map(
          (reply) => new ReplyDetails(reply),
        );
        return new CommentDetails({ ...comment, replies: formattedRepiles });
      }),
    );

    return new ThreadDetails({ ...thread, comments: commentsWithReplies });
  }
}
