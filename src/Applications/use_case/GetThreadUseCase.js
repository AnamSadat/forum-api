import CommentDetails from '../../Domains/comments/entities/CommentDetails.js';
import ReplyDetails from '../../Domains/replies/entities/ReplyDetails.js';
import ThreadDetails from '../../Domains/threads/entities/ThreadDetails.js';

export default class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload);

    const thread = await this._threadRepository.getThreadById(useCasePayload);

    const comments =
      await this._commentRepository.getCommentByThreadId(useCasePayload);

    const likes = await this._likeRepository.getLikesByThreadId(useCasePayload);

    const likesMap = {};
    likes.forEach((like) => {
      likesMap[like.comment_id] = like.like_count;
    });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getReplyByCommentId(
          comment.id,
        );
        const formattedRepiles = replies.map(
          (reply) => new ReplyDetails(reply),
        );
        return new CommentDetails({
          ...comment,
          replies: formattedRepiles,
          likeCount: likesMap[comment.id] || 0,
        });
      }),
    );

    return new ThreadDetails({ ...thread, comments: commentsWithReplies });
  }
}
