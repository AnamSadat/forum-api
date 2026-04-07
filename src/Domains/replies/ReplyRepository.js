export default class ReplyRepository {
  async addReply(newReply) {
    console.log('🚀 ~ ReplyRepository ~ addReply ~ newReply:', newReply);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyExist(replyId) {
    console.log('🚀 ~ ReplyRepository ~ verifyReplyExist ~ ReplyId:', replyId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner({ replyId, userId }) {
    console.log('🚀 ~ ReplyRepository ~ verifyReplyOwner ~ userId:', userId);
    console.log('🚀 ~ ReplyRepository ~ verifyReplyOwner ~ ReplyId:', replyId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getReplyByCommentId(commentId) {
    console.log(
      '🚀 ~ ReplyRepository ~ getReplyByCommentId ~ commentId:',
      commentId,
    );
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(replyId) {
    console.log('🚀 ~ ReplyRepository ~ deleteReplyById ~ ReplyId:', replyId);
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}
