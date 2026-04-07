export default class CommentRepository {
  async addComment(newComment) {
    console.log(
      '🚀 ~ CommentRepository ~ addComment ~ newComment:',
      newComment,
    );
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentExist(commentId) {
    console.log(
      '🚀 ~ CommentRepository ~ verifyCommentExist ~ commentId:',
      commentId,
    );
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner({ commentId, userId }) {
    console.log(
      '🚀 ~ CommentRepository ~ verifyCommentOwner ~ userId:',
      userId,
    );
    console.log(
      '🚀 ~ CommentRepository ~ verifyCommentOwner ~ commentId:',
      commentId,
    );
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentByThreadId(threadId) {
    console.log(
      '🚀 ~ CommentRepository ~ getCommentByThreadId ~ threadId:',
      threadId,
    );
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentById(commentId) {
    console.log(
      '🚀 ~ CommentRepository ~ deleteCommentById ~ commentId:',
      commentId,
    );
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
