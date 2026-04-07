import InvariantError from '../../../Commons/exceptions/InvariantError.js';

export default class ThreadDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload(payload) {
    const { id, title, body, date, username, comments } = payload;

    if (!id || !title || !body || !date || !username || !comments)
      throw new InvariantError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      !(
        Array.isArray(comments) &&
        comments.every(
          (comment) => typeof comment === 'object' && comment !== null,
        )
      )
    )
      throw new InvariantError(
        'THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
  }
}
