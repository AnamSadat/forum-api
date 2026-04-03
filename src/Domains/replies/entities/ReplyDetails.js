export default class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, date, username } = this._formatPayload(payload);

    this._id = id;
    this._content = content;
    this._date = date;
    this._username = username;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('REPLY_DETAILS.PAYLOAD_REQUIRED');

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
    if (!payload) throw new Error('REPLY_DETAILS.REQUIRED_PAYLOAD');

    const { id, content, date, username, is_deleted: isDeleted } = payload;

    return {
      id,
      content: isDeleted ? '**balasan telah dihapus**' : content,
      date,
      username,
    };
  }
}
