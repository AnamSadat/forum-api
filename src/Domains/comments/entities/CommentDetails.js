export default class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, replies } =
      this._formatPayload(payload);

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    const {
      id,
      content,
      date,
      username,
      replies,
      is_deleted: isDeleted,
    } = payload;

    if (
      !id ||
      !content ||
      !date ||
      !username ||
      !replies ||
      isDeleted === undefined
    )
      throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      !(
        Array.isArray(replies) &&
        replies.every((reply) => typeof reply === 'object' && reply !== null)
      ) ||
      typeof isDeleted !== 'boolean'
    )
      throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  _formatPayload(payload) {
    const {
      id,
      content,
      date,
      username,
      replies,
      is_deleted: isDeleted,
    } = payload;

    return {
      id,
      content: isDeleted ? '**komentar telah dihapus**' : content,
      date,
      replies,
      username,
    };
  }
}
