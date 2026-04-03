export default class ReplyRepository {
  async addReply(newReply) {
    console.log('🚀 ~ ReplyRepository ~ addReply ~ newReply:', newReply);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyExist(ReplyId) {
    console.log('🚀 ~ ReplyRepository ~ verifyReplyExist ~ ReplyId:', ReplyId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(ReplyId) {
    console.log('🚀 ~ ReplyRepository ~ verifyReplyOwner ~ ReplyId:', ReplyId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getReplyByCommentId(commentId) {
    console.log(
      '🚀 ~ ReplyRepository ~ getReplyByCommentId ~ commentId:',
      commentId,
    );
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(ReplyId) {
    console.log('🚀 ~ ReplyRepository ~ deleteReplyById ~ ReplyId:', ReplyId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
