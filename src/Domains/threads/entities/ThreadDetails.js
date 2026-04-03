export default class ThreadDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this._id = id;
    this._title = title;
    this._body = body;
    this._date = date;
    this._username = username;
    this._comments = comments;
  }

  _verifyPayload(payload) {
    if (!payload) throw new Error('THREAD_DETAILS.PAYLOAD_REQUIRED');

    const { id, title, body, date, username, comments } = payload;

    if (!id || !title || !body || !date || !username || !comments)
      throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      !(
        Array.isArray(comments) &&
        comments.every(
          (comment) => typeof comment === 'object' && comment === null,
        )
      )
    )
      throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }
}
