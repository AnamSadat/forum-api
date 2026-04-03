export default class CommentDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username, replies } =
      this._formatPayload(payload);

    this._id = id;
    this._content = content;
    this._date = date;
    this._username = username;
    this._replies = replies;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('COMMENT_DETAILS.PAYLOAD_REQUIRED');

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
    if (!payload) throw new Error('COMMENT_DETAILS.REQUIRED_PAYLOAD');

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
      content: isDeleted ? '**balasan telah dihapus**' : content,
      date,
      replies,
      username,
    };
  }
}
