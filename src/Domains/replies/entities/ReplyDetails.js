export default class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username } = this._formatPayload(payload);

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload(payload) {
    const { id, content, date, username, is_deleted: isDeleted } = payload;

    if (!id || !content || !date || !username || isDeleted === undefined)
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      typeof isDeleted !== 'boolean'
    )
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  _formatPayload(payload) {
    const { id, content, date, username, is_deleted: isDeleted } = payload;

    return {
      id,
      content: isDeleted ? '**balasan telah dihapus**' : content,
      date,
      username,
    };
  }
}
